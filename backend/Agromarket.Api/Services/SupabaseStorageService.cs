using System.Net;
using System.Net.Http.Headers;

namespace Agromarket.Api.Services;

public sealed class SupabaseStorageService
{
    private static readonly HttpClient HttpClient = new();

    private readonly string _url;
    private readonly string _secretKey;
    private readonly string _bucket;

    public SupabaseStorageService(
        IConfiguration configuration)
    {
        _url =
            configuration["Supabase:Url"]?.TrimEnd('/')
            ?? throw new InvalidOperationException(
                "Supabase:Url no está configurado."
            );

        _secretKey =
            configuration["Supabase:SecretKey"]
            ?? throw new InvalidOperationException(
                "Supabase:SecretKey no está configurado."
            );

        _bucket =
            configuration["Supabase:Bucket"]
            ?? throw new InvalidOperationException(
                "Supabase:Bucket no está configurado."
            );

        if (string.IsNullOrWhiteSpace(_url))
        {
            throw new InvalidOperationException(
                "Supabase:Url está vacío."
            );
        }

        if (string.IsNullOrWhiteSpace(_secretKey))
        {
            throw new InvalidOperationException(
                "Supabase:SecretKey está vacío."
            );
        }

        if (string.IsNullOrWhiteSpace(_bucket))
        {
            throw new InvalidOperationException(
                "Supabase:Bucket está vacío."
            );
        }
    }

    public async Task<string> UploadAsync(
        IFormFile file,
        string objectPath,
        CancellationToken cancellationToken = default)
    {
        var requestUrl =
            BuildObjectUrl(objectPath);

        using var request =
            new HttpRequestMessage(
                HttpMethod.Post,
                requestUrl
            );

        request.Headers.TryAddWithoutValidation(
            "apikey",
            _secretKey
        );

        request.Headers.TryAddWithoutValidation(
            "x-upsert",
            "false"
        );

        using var stream =
            file.OpenReadStream();

        using var content =
            new StreamContent(stream);

        content.Headers.ContentType =
            MediaTypeHeaderValue.Parse(
                file.ContentType
            );

        request.Content = content;

        using var response =
            await HttpClient.SendAsync(
                request,
                HttpCompletionOption.ResponseHeadersRead,
                cancellationToken
            );

        if (!response.IsSuccessStatusCode)
        {
            var responseText =
                await response.Content.ReadAsStringAsync(
                    cancellationToken
                );

            throw new InvalidOperationException(
                $"Supabase Storage devolvió {(int)response.StatusCode}: {responseText}"
            );
        }

        return BuildPublicUrl(
            objectPath
        );
    }

    public async Task<bool> DeleteByPublicUrlAsync(
        string? publicUrl,
        CancellationToken cancellationToken = default)
    {
        var objectPath =
            TryGetObjectPath(
                publicUrl
            );

        if (objectPath is null)
        {
            return false;
        }

        using var request =
            new HttpRequestMessage(
                HttpMethod.Delete,
                BuildObjectUrl(
                    objectPath
                )
            );

        request.Headers.TryAddWithoutValidation(
            "apikey",
            _secretKey
        );

        using var response =
            await HttpClient.SendAsync(
                request,
                cancellationToken
            );

        if (
            response.StatusCode ==
            HttpStatusCode.NotFound)
        {
            return true;
        }

        if (!response.IsSuccessStatusCode)
        {
            var responseText =
                await response.Content.ReadAsStringAsync(
                    cancellationToken
                );

            throw new InvalidOperationException(
                $"No se pudo eliminar la imagen de Supabase Storage: {responseText}"
            );
        }

        return true;
    }

    private string BuildObjectUrl(
        string objectPath)
    {
        var encodedBucket =
            Uri.EscapeDataString(
                _bucket
            );

        var encodedPath =
            EncodeObjectPath(
                objectPath
            );

        return
            $"{_url}/storage/v1/object/{encodedBucket}/{encodedPath}";
    }

    private string BuildPublicUrl(
        string objectPath)
    {
        var encodedBucket =
            Uri.EscapeDataString(
                _bucket
            );

        var encodedPath =
            EncodeObjectPath(
                objectPath
            );

        return
            $"{_url}/storage/v1/object/public/{encodedBucket}/{encodedPath}";
    }

    private string? TryGetObjectPath(
        string? publicUrl)
    {
        if (
            string.IsNullOrWhiteSpace(
                publicUrl))
        {
            return null;
        }

        if (
            !Uri.TryCreate(
                publicUrl,
                UriKind.Absolute,
                out var uri))
        {
            return null;
        }

        var expectedHost =
            new Uri(_url).Host;

        if (
            !string.Equals(
                uri.Host,
                expectedHost,
                StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var decodedPath =
            Uri.UnescapeDataString(
                uri.AbsolutePath
            );

        var expectedPrefix =
            $"/storage/v1/object/public/{_bucket}/";

        if (
            !decodedPath.StartsWith(
                expectedPrefix,
                StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var objectPath =
            decodedPath[
                expectedPrefix.Length..
            ];

        return
            string.IsNullOrWhiteSpace(
                objectPath)
                ? null
                : objectPath;
    }

    private static string EncodeObjectPath(
        string objectPath)
    {
        return string.Join(
            "/",
            objectPath
                .Split(
                    '/',
                    StringSplitOptions.RemoveEmptyEntries
                )
                .Select(
                    Uri.EscapeDataString
                )
        );
    }
}