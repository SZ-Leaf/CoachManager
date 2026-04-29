<?php

namespace App\Enum;

enum PlayerStatus: string
{
    case Active = 'active';
    case Injured = 'injured';
    case Suspended = 'suspended';
    case Inactive = 'inactive';
}
