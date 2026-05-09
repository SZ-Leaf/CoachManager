<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface;

/**
 * Réponses JSON pour les routes /api sans session valide (évite du HTML qui casse le parse côté SPA).
 */
final class JsonUnauthorizedEntryPoint implements AuthenticationEntryPointInterface
{
    public function start(Request $request, ?AuthenticationException $authException = null): Response
    {
        return new JsonResponse(
            ['message' => 'Authentification requise'],
            Response::HTTP_UNAUTHORIZED,
        );
    }
}
