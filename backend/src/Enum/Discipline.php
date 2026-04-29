<?php

namespace App\Enum;

enum Discipline: string
{
    case Football = 'football';
    case Basketball = 'basketball';
    case Rugby = 'rugby';
    case Tennis = 'tennis';
    case Volleyball = 'volleyball';
    case Handball = 'handball';
    case Other = 'other';
}
