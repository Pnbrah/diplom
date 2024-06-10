export const API_URL = 'http://localhost:1337';
export const API_TOKEN = '3edea083405efad219925296cf692dc64cd4528687c306764b679043e92a8eaddb344c09ef178f9cb816fe5b83682af5656c214302199ed080567f917027533df38ad95ee85a057a4de033f6f9f3091c9c5214aa213b898b99d4e2133dc9a0968f6b69ae65a575fdc9159cf29a1d6fb2a202cc40f445c861d5e1bba4738e6abf';

import { FormData } from './interfaces';

export const initialFormData: FormData = {
    operation: '',
    number: '',
    date: null,
    headquarterSender: '',
    warehouseSender: '',
    headquarterReceiver: '',
    warehouseReceiver: '',
    basis: '',
    basisHeadquarter: '',
    basisDate: null,
    basisNumber: null,
    headRAO: '',
    headRAORank: '',
    headRAOName: '',
    headFES: '',
    headFESRank: '',
    headFESName: '',
    clerk: '',
    clerkRank: '',
    clerkName: '',
    warehouseHead: '',
    warehouseHeadRank: '',
    warehouseHeadName: '',
    warehouseStatus: '',
    recipient: '',
    recipientStatus: '',
    recipientRank: '',
    recipientName: '',
};