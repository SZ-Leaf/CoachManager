<?php

namespace App\Service;

use App\Exceptions\User\UpdateUserException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final class AvatarUploadHandler
{
    private const int MAX_BYTES = 2_097_152;

    /** @var list<string> */
    private const array ALLOWED_MIME = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
    ];

    public function __construct(
        private readonly string $avatarDirectory,
    ) {
    }

    /**
     * @throws UpdateUserException
     */
    public function store(UploadedFile $file): string
    {
        if (!$file->isValid()) {
            throw UpdateUserException::validationFailed([
                ['field' => 'avatar', 'message' => 'Invalid upload.'],
            ]);
        }

        if ($file->getSize() > self::MAX_BYTES) {
            throw UpdateUserException::validationFailed([
                ['field' => 'avatar', 'message' => 'Avatar must be at most 2 MB.'],
            ]);
        }

        $path = $file->getPathname();
        $finfo = new \finfo(\FILEINFO_MIME_TYPE);
        $mime = $finfo->file($path) ?: '';
        if (!\in_array($mime, self::ALLOWED_MIME, true)) {
            throw UpdateUserException::validationFailed([
                ['field' => 'avatar', 'message' => 'Only JPEG, PNG, GIF, and WebP images are allowed.'],
            ]);
        }

        $ext = strtolower($file->guessExtension() ?? '');
        if (!\in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'], true)) {
            throw UpdateUserException::validationFailed([
                ['field' => 'avatar', 'message' => 'Invalid file extension.'],
            ]);
        }

        if ($ext === 'jpeg') {
            $ext = 'jpg';
        }

        if (!is_dir($this->avatarDirectory)) {
            mkdir($this->avatarDirectory, 0775, true);
        }

        $basename = bin2hex(random_bytes(16)).'.'.$ext;
        $file->move($this->avatarDirectory, $basename);

        return '/uploads/avatars/'.$basename;
    }
}
