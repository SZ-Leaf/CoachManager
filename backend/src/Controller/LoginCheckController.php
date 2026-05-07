<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Target for json_login (api_auth_login). The authenticator handles POST; this is only a route anchor.
 */
final class LoginCheckController
{
    #[Route('/api/auth/login', name: 'api_auth_login', methods: ['POST'])]
    public function __invoke(): Response
    {
        return new Response(null, Response::HTTP_UNAUTHORIZED);
    }
}
