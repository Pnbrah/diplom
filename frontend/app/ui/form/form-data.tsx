'use client';

import { useState } from 'react';
import 'dayjs/locale/uk';
import { Select, TextInput } from '@mantine/core';
import { DatesProvider, DateInput } from '@mantine/dates';
import classes from './form-data.module.css';
import FormDataTableWithProviders from './form-data-table';


export function Invoice() {
    const [value, setValue] = useState<Date | null>(null);
    const [value1, setValue1] = useState<Date | null>(null);
    return (
        <div>
            <Select
                data={['Накладна 1', 'Накладна 2', 'Накладна 3', 'Накладна 4']}
                placeholder="Наприклад, Накладна 1"
                label="Операція"
                classNames={classes}
                required
            />
            <div className='flex space-x-3 py-1'>
                <TextInput label="Номер" placeholder="14/01/1991" classNames={classes} required />

                <DatesProvider settings={{ locale: 'uk', firstDayOfWeek: 1, weekendDays: [0, 6] }}>
                    <DateInput
                        value={value}
                        valueFormat="DD MMMM YYYY"
                        onChange={setValue}
                        label="від"
                        placeholder="Дата"
                        classNames={classes}
                        required
                    />
                </DatesProvider>
            </div>

            <div className='flex space-x-3 py-1'>
                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Наприклад, A0000"
                    label="Вантажовідправник"
                    classNames={classes}
                    required
                />

                <Select
                    data={['(склад РАО)', '(ППО)', '(артилерія)', '(рота логістики)']}
                    placeholder="Наприклад, (склад РАО)"
                    label="Склад (підрозділ)"
                    classNames={classes}
                    required
                />
            </div>

            <div className='flex space-x-3 py-1'>
                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Наприклад, A0000"
                    label="Вантажоодержувач"
                    classNames={classes}
                    required
                />

                <Select
                    data={['(склад РАО)', '(ППО)', '(артилерія)', '(рота логістики)']}
                    placeholder="Наприклад, (склад РАО)"
                    label="Склад (підрозділ)"
                    classNames={classes}
                    required
                />
            </div>

            <div className='flex space-x-3 py-1'>
                <Select
                    data={['Розпорядження', 'Наказ', 'Заявка', 'Наряд']}
                    placeholder="Pick one"
                    label="Підстава (мета)"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />

                <DatesProvider settings={{ locale: 'uk', firstDayOfWeek: 1, weekendDays: [0, 6] }}>
                    <DateInput
                        value={value1}
                        valueFormat="DD MMMM YYYY"
                        onChange={setValue1}
                        label="від"
                        placeholder="Дата"
                        classNames={classes}
                        required
                    />
                </DatesProvider>

                <TextInput label="№" placeholder="Номер" classNames={classes} required />
            </div>

            <div className='py-3'>
                <FormDataTableWithProviders />
            </div>

            <div className='flex space-x-3 py-1'>
                <Select
                    data={['Розпорядження', 'Наказ', 'Заявка', 'Наряд']}
                    placeholder="Pick one"
                    label="Нач РАО"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />
            </div>

            <div className='flex space-x-3 py-1'>
                <Select
                    data={['Розпорядження', 'Наказ', 'Заявка', 'Наряд']}
                    placeholder="Pick one"
                    label="Нач ФЕС"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />
            </div>

            <div className='flex space-x-3 py-1'>
                <Select
                    data={['Розпорядження', 'Наказ', 'Заявка', 'Наряд']}
                    placeholder="Pick one"
                    label="Діловод РАО"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />
            </div>

            <div className='flex space-x-3 py-1'>
                <Select
                    data={['Розпорядження', 'Наказ', 'Заявка', 'Наряд']}
                    placeholder="Pick one"
                    label="Нач Складу"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />
            </div>

            <div className='flex space-x-3 py-1'>
                <Select
                    data={['Розпорядження', 'Наказ', 'Заявка', 'Наряд']}
                    placeholder="Pick one"
                    label="Одержувач"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />

                <Select
                    data={['A0000', 'A0001', 'A0002', 'A0003']}
                    placeholder="Pick one"
                    label="-"
                    classNames={classes}
                    required
                />
            </div>
        </div>
    );
}