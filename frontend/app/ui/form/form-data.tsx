'use client';

import { useState, useEffect } from 'react';
import 'dayjs/locale/uk';
import { Select, TextInput, Button } from '@mantine/core';
import { DatesProvider, DateInput } from '@mantine/dates';
import classes from './form-data.module.css';
import FormDataTableWithProviders from './form-data-table';
import { initialFormData } from '@/app/api/data/constants';
import { FormData } from '@/app/api/data/interfaces';
import { fetchSelectData, saveInvoice } from '@/app/api/data/api';

export function Invoice() {
    const [value, setValue] = useState<Date | null>(null);
    const [value1, setValue1] = useState<Date | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [selectData, setSelectData] = useState({
        operations: [],
        headquarters: [],
        warehouses: [],
        bases: [],
        positions: [],
        ranks: [],
        names: [],
        actions: [],
    });

    useEffect(() => {
        async function getData() {
            try {
                const data = await fetchSelectData();
                setSelectData(data);
            } catch (error) {
                console.error('Failed to fetch select data', error);
            }
        }

        getData();
    }, []);

    const handleChange = (field: string, value: any) => {
        setFormData(prevState => ({ ...prevState, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.operation || !formData.number || !formData.basis || !formData.headRAO || !formData.headFES || !formData.clerk || !formData.warehouseStatus || !formData.recipientStatus) {
            alert('Будь ласка, заповніть всі обов\'язкові поля');
            return;
        }
        // 2. Відправка даних на сервер, якщо форма заповнена
        try {
          await saveInvoice(formData);
          alert('Дані успішно збережені');
          setFormData(initialFormData);
          setValue(null);
          setValue1(null);
        } catch (error) {
          alert('Помилка збереження даних');
        }
      };

    const renderSelects = (fields: Array<{ label: string, field: string, data: any[], handleChange: (field: string, value: any) => void }>) => {
        return fields.map(({ label, field, data, handleChange }) => (
            <Select
                key={field}
                data={data}
                placeholder={`Оберіть ${label.toLowerCase()}`}
                label={label}
                classNames={classes}
                required
                onChange={(value) => handleChange(field, value)}
            />
        ));
    };

    return (
        <div>
            <Select
                data={selectData.operations}
                placeholder="Наприклад, АПП"
                label="Операція"
                classNames={classes}
                required
                onChange={(value) => handleChange('operation', value)}
            />
            <div className='flex space-x-3 py-1'>
                <TextInput
                    label="Номер"
                    placeholder="14/01/1991"
                    classNames={classes}
                    required
                    onChange={(event) => handleChange('number', event.currentTarget.value)}
                />

                <DatesProvider settings={{ locale: 'uk', firstDayOfWeek: 1, weekendDays: [0, 6] }}>
                    <DateInput
                        value={value}
                        valueFormat="DD MMMM YYYY"
                        onChange={(date) => {
                            setValue(date);
                            handleChange('basisDate', date);
                        }}
                        label="від"
                        placeholder="Дата"
                        classNames={classes}
                        required
                    />
                </DatesProvider>
            </div>

            <div className='flex space-x-3 py-1'>
                {renderSelects([
                    { label: 'Вантажовідправник', field: 'headquarterSender', data: selectData.headquarters, handleChange },
                    { label: 'Склад (підрозділ)', field: 'warehouseSender', data: selectData.warehouses, handleChange },
                ])}
            </div>

            <div className='flex space-x-3 py-1'>
                {renderSelects([
                    { label: 'Вантажоодержувач', field: 'headquarterReceiver', data: selectData.headquarters, handleChange },
                    { label: 'Склад (підрозділ)', field: 'warehouseReceiver', data: selectData.warehouses, handleChange },
                ])}
            </div>

            <div className='flex space-x-3 py-1'>
                {renderSelects([
                    { label: 'Підстава (мета)', field: 'basis', data: selectData.bases, handleChange },
                    { label: ' ', field: 'basisHeadquarter', data: selectData.headquarters, handleChange },
                ])}
                <DatesProvider settings={{ locale: 'uk', firstDayOfWeek: 1, weekendDays: [0, 6] }}>
                    <DateInput
                        value={value1}
                        valueFormat="DD MMMM YYYY"
                        onChange={(date) => {
                            setValue1(date);
                            handleChange('basisDate', date);
                        }}
                        label="від"
                        placeholder="Дата"
                        classNames={classes}
                        required
                    />
                </DatesProvider>

                <TextInput
                    label="№"
                    placeholder="Номер"
                    classNames={classes}
                    required
                    onChange={(event) => handleChange('basisNumber', event.currentTarget.value)}
                />
            </div>

            <div className='py-3'>
                <FormDataTableWithProviders />
            </div>

            <div className='flex space-x-3 py-1'>
                {renderSelects([
                    { label: 'Нач РАО', field: 'headRAO', data: selectData.positions, handleChange },
                    { label: 'звання', field: 'headRAORank', data: selectData.ranks, handleChange },
                    { label: 'ім\'я', field: 'headRAOName', data: selectData.names, handleChange },
                ])}
            </div>

            <div className='flex space-x-3 py-1'>
                {renderSelects([
                    { label: 'Нач ФЕС', field: 'headFES', data: selectData.positions, handleChange },
                    { label: 'звання', field: 'headFESRank', data: selectData.ranks, handleChange },
                    { label: 'ім\'я', field: 'headFESName', data: selectData.names, handleChange },
                ])}
            </div>

            <div className='flex space-x-3 py-1'>
                {renderSelects([
                    { label: 'Діловод РАО', field: 'clerk', data: selectData.positions, handleChange },
                    { label: 'звання', field: 'clerkRank', data: selectData.ranks, handleChange },
                    { label: 'ім\'я', field: 'clerkName', data: selectData.names, handleChange },
                ])}
            </div>

            <div className='flex space-x-3 py-1'>
                {renderSelects([
                    { label: 'Нач Складу', field: 'warehouseStatus', data: selectData.actions, handleChange },
                    { label: 'посада', field: 'warehouseHead', data: selectData.positions, handleChange },
                    { label: 'звання', field: 'warehouseHeadRank', data: selectData.ranks, handleChange },
                    { label: 'ім\'я', field: 'warehouseHeadName', data: selectData.names, handleChange },
                ])}
            </div>

            <div className='flex space-x-3 py-1'>
                {renderSelects([
                    { label: 'Одержувач', field: 'recipientStatus', data: selectData.actions, handleChange },
                    { label: 'посада', field: 'recipient', data: selectData.positions, handleChange },
                    { label: 'звання', field: 'recipientRank', data: selectData.ranks, handleChange },
                    { label: 'ім\'я', field: 'recipientName', data: selectData.names, handleChange },
                ])}
            </div>

            <Button onClick={handleSubmit} className='my-5' variant="filled" color="blue">ЗБЕРЕГТИ</Button>
        </div>
    );
}