<?php

namespace App\Enum;

enum CommunicationStatus: string
{
    case Sent = 'sent';
    case Failed = 'failed';
}
