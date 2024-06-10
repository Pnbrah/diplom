'use client';

import React from 'react';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import axios from 'axios';

let PizZipUtils = null;

interface InvoiceItem {
    id: number;
    attributes: {
      operation: string,
      number: string,
      date: Date | null,
      headquarterSender: string,
      warehouseSender: string,
      headquarterReceiver: string,
      warehouseReceiver: string,
      basis: string,
      basisHeadquarter: string,
      basisDate: Date | null,
      basisNumber: string,
      headRAO: string,
      headRAORank: string,
      headRAOName: string,
      headFES: string,
      headFESRank: string,
      headFESName: string,
      clerk: string,
      clerkRank: string,
      clerkName: string,
      warehouseHead: string,
      warehouseHeadRank: string,
      warehouseHeadName: string,
      warehouseStatus: string,
      recipient: string,
      recipientStatus: string,
      recipientRank: string,
      recipientName: string,
      items: { // Масив об'єктів Item
        data: {
          id: number;
          attributes: {
            itemList: string;
            itemNumber: number ;
            quantity: number;
            price: number;
          };
        }[];
      };
    };
  }
  
if (typeof window !== 'undefined') {
  import('pizzip/utils/index.js').then(function (r) {
    PizZipUtils = r;
  });
}

const API_URL = 'http://localhost:1337';
const API_TOKEN = '3edea083405efad219925296cf692dc64cd4528687c306764b679043e92a8eaddb344c09ef178f9cb816fe5b83682af5656c214302199ed080567f917027533df38ad95ee85a057a4de033f6f9f3091c9c5214aa213b898b99d4e2133dc9a0968f6b69ae65a575fdc9159cf29a1d6fb2a202cc40f445c861d5e1bba4738e6abf';

async function fetchInvoiceData(invoiceId = 1): Promise<InvoiceItem> {
  const response = await axios.get(
    `${API_URL}/api/invoices/`,
    {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    }
  );

  if (response.status !== 200) {
    throw new Error('Failed to fetch invoice data');
  }

  return response.data.data as InvoiceItem;
}

async function loadFileAsBinary(url: string | URL | Request) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load file from ${url}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export const generateDocument = async (invoiceId = 1) => {
  try {
    const content = await loadFileAsBinary('/invoice_1.docx'); // Adjusted path to load the local file

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      linebreaks: true,
      paragraphLoop: true,
    });

    // Отримання даних накладної з API Strapi
    const invoiceData = await fetchInvoiceData(invoiceId);

    if (invoiceData) {
      doc.render({
        operation: invoiceData.attributes.operation,
        number: invoiceData.attributes.number,
        date: invoiceData.attributes.date ? invoiceData.attributes.date.toLocaleDateString('uk-UA') : '',
        headquarterSender: invoiceData.attributes.headquarterSender,
        warehouseSender: invoiceData.attributes.warehouseSender,
        headquarterReceiver: invoiceData.attributes.headquarterReceiver,
        warehouseReceiver: invoiceData.attributes.warehouseReceiver,
        basis: invoiceData.attributes.basis,
        basisHeadquarter: invoiceData.attributes.basisHeadquarter,
        basisDate: invoiceData.attributes.basisDate ? invoiceData.attributes.basisDate.toLocaleDateString('uk-UA') : '',
        basisNumber: invoiceData.attributes.basisNumber,
        headRAO: invoiceData.attributes.headRAO,
        headRAORank: invoiceData.attributes.headRAORank,
        headRAOName: invoiceData.attributes.headRAOName,
        headFES: invoiceData.attributes.headFES,
        headFESRank: invoiceData.attributes.headFESRank,
        headFESName: invoiceData.attributes.headFESName,
        clerk: invoiceData.attributes.clerk,
        clerkRank: invoiceData.attributes.clerkRank,
        clerkName: invoiceData.attributes.clerkName,
        warehouseHead: invoiceData.attributes.warehouseHead,
        warehouseHeadRank: invoiceData.attributes.warehouseHeadRank,
        warehouseHeadName: invoiceData.attributes.warehouseHeadName,
        warehouseStatus: invoiceData.attributes.warehouseStatus,
        recipient: invoiceData.attributes.recipient,
        recipientStatus: invoiceData.attributes.recipientStatus,
        recipientRank: invoiceData.attributes.recipientRank,
        recipientName: invoiceData.attributes.recipientName,
        items: invoiceData.attributes.items.data.map(item => ({
          itemList: item.attributes.itemList,
          itemNumber: item.attributes.itemNumber,
          quantity: item.attributes.quantity,
          price: item.attributes.price
        }))
      });
    } else {
      // Обробка помилки, якщо дані накладної не знайдено
      console.error('Invoice data not found.');
    }
    const blob = doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    // Output the document using Data-URI
    saveAs(blob, 'invoice.docx');
  } catch (error) {
    console.error('Error generating document:', error);
  }
};
