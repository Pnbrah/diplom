import axios from 'axios';
import { API_URL, API_TOKEN } from './constants';


export async function fetchSelectData() {
    try {
        const endpoints = [
            'operations',
            'headquarters',
            'warehouses',
            'bases',
            'positions',
            'people',
            'actions'
        ];

        const fetchPromises = endpoints.map(endpoint => 
            axios.get(`${API_URL}/api/${endpoint}`, {
                headers: { Authorization: `Bearer ${API_TOKEN}` }
            })
        );

        const responses = await Promise.all(fetchPromises);

        return {
            operations: responses[0].data.data.map((item: { attributes: { name: any; }; }) => item.attributes.name),
            headquarters: responses[1].data.data.map((item: { attributes: { code: any; }; }) => item.attributes.code),
            warehouses: responses[2].data.data.map((item: { attributes: { name: any; }; }) => item.attributes.name),
            bases: responses[3].data.data.map((item: { attributes: { name: any; }; }) => item.attributes.name),
            positions: responses[4].data.data.map((item: { attributes: { name: any; }; }) => item.attributes.name),
            ranks: responses[5].data.data.map((item: { attributes: { rank: any; }; }) => item.attributes.rank),
            names: responses[5].data.data.map((item: { attributes: { name: any; }; }) => item.attributes.name),
            actions: responses[6].data.data.map((item: { attributes: { name: any; }; }) => item.attributes.name),
        };
    } catch (error) {
        console.error('Failed to fetch select data', error);
        throw error;
    }
}

export async function saveInvoice(data: any) {
    try {
        const response = await axios.post(
            `${API_URL}/api/invoices`,
            { data },
            { headers: { Authorization: `Bearer ${API_TOKEN}` } }
        );

        if (response.status !== 200) {
            throw new Error('Failed to save data');
        }

        return response.data;
    } catch (error) {
        console.error('Failed to save data', error);
        throw error;
    }
}

export type Item = {
  id: string;
  itemList: string;
  itemNumber: string;
  quantity: string;
  price: string;
};

export async function listNames() {
  const res = await fetch(`${API_URL}/api/itemlists`, {
    headers: {
      authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const { data } = await res.json();
  return data.map((item: { attributes: { list: string } }) => item.attributes.list);
}

export const fakeData: Item[] = [];