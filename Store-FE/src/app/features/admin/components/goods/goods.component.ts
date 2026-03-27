import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service';
import { CoreAuthService } from '../../../../core/services/core-auth.service';
import { emptyGood, emptyGoodTemplate, IGood, IGoodTemplate, ZIGood } from '../../../../core/models/good.model';
import { EditorMode, GoodEditorComponent } from '../good-editor/good-editor.component';
import { PriceModifierComponent } from './price-modifier.component';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { LangPipe } from '../../../../core/pipes/lang-pipe';
import { FormsModule } from '@angular/forms';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { Tooltip } from 'primeng/tooltip';
import { NotificationService } from '../../../../core/services/notification.service';
import { languagesService } from '../../../../../assets/languages/languages.service';
import readXlsxFile, { CellValue, Row } from 'read-excel-file/browser';
import { COPY } from '../../../../core/services/utils.service';
import { TAny, TAnyObject } from '../../../../core/services/utils.types';
import { ApiService } from '../../../../core/services/api.service';

@Component({
    selector: 'app-goods-tab',
    standalone: true,
    imports: [CommonModule, GoodEditorComponent, PriceModifierComponent, Button, TableModule, LangPipe, FormsModule, FileUpload, Tooltip],
    templateUrl: './goods.component.html',
    styleUrl: './goods.component.less',
})
export class GoodsTabComponent {

    protected readonly storageService: StorageService = inject(StorageService);
    protected readonly authService: CoreAuthService = inject(CoreAuthService);
    protected readonly notificationService: NotificationService = inject(NotificationService);
    protected readonly apiService: ApiService = inject(ApiService);

    protected isEditorOpen: WritableSignal<boolean> = signal(false);
    protected editorMode: WritableSignal<EditorMode> = signal('view');
    protected selectedItem: WritableSignal<IGood | null> = signal(null);

    protected isPriceModifierOpen: WritableSignal<boolean> = signal(false);

    protected readonly goodKeys: (keyof IGood)[] = this.getAndSortGoodKeys();

    openAdd() {
        this.selectedItem.set(null);
        this.editorMode.set('add');
        this.isEditorOpen.set(true);
    }

    openView(item: IGood) {
        this.selectedItem.set(item);
        this.editorMode.set('view');
        this.isEditorOpen.set(true);
    }

    openEdit(item: IGood) {
        this.selectedItem.set(item);
        this.editorMode.set('edit');
        this.isEditorOpen.set(true);
    }

    deleteItem(id: number) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.storageService.deleteGood(id)
                .then(() => {
                    this.notificationService.show(languagesService
                        .transform('success', 'good_3'), 'success');

                    // this.modalClose.emit(); // todo replace `confirm` with own popup
                })
                .catch(() => {
                    this.notificationService.show(languagesService
                        .transform('errors', 'good_3'), 'error');
                })
                .finally(() => {
                    this.storageService.fetchGoods();
                });
        }
    }

    applyModifier(multiplier: number) {
        this.storageService.applyPriceModifier(multiplier);
    }

    async onFileSelected(event: FileSelectEvent) {
        if (!event.currentFiles?.length) {
            this.notificationService.show(languagesService.transform('errors', 'good_file_1'), 'error');
            return;
        }

        const nullCheck = (_rows: Row[]): boolean => {
            const nonNullKeys: CellValue[] | undefined = _rows[0]
                ?.filter((row: CellValue | null) => row !== null);

            if (!_rows.length || !nonNullKeys?.length) {
                console.error('No rows or no non-null keys');
                this.notificationService.show(languagesService.transform('errors', 'good_file_2'), 'error');
                return false;
            }
            return true;
        };
        const unknownCheck = (_rows: Row[]): boolean => {
            const nonNullKeys: CellValue[] = _rows[0]
                .filter((row: CellValue | null) => row !== null);

            const keys: string[] = nonNullKeys.map((row: CellValue | null) => String(row));
            const goodKeys: (keyof IGood)[] = Object.keys(emptyGood) as (keyof IGood)[];
            const invalidKeys: string[] = keys.filter((k: string) => !goodKeys.includes(k as keyof IGood));
            if (invalidKeys.length) {
                console.error('Unknown keys: ', invalidKeys);
                this.notificationService.show(languagesService.transform('errors', 'good_file_3'), 'error');
                return false;
            }
            return true;
        };
        const lengthCheck = (_rows: Row[]): boolean => {
            for (let j = _rows[0].length - 1; j >= 0; j--) {
                if (_rows[0][j] === null) {
                    _rows[0].splice(j, 1);
                } else {
                    break;
                }
            }
            const trimmedRows: Row[] = COPY(_rows);
            for (const row of trimmedRows) {
                if (trimmedRows.indexOf(row) === 0) {
                    continue;
                }
                for (let j = row.length - 1; j >= 0; j--) {
                    if (row[j] === null) {
                        row.splice(j, 1);
                    } else {
                        break;
                    }
                }
            }

            let constLength: number | undefined = undefined;
            const wrongRows: number[] = [];
            trimmedRows.forEach((row: Row, index: number) => {
                if (!constLength) {
                    constLength = row.length;
                    return;
                }
                if (row.length > constLength) {
                    wrongRows.push(index + 1);
                }
            });
            if (wrongRows.length) {
                console.error('Wrong rows length\'s: ', wrongRows);
                this.notificationService.show(languagesService.transform('errors', 'good_file_4'), 'error');
                return false;
            }
            return true;
        };
        const typesCheckHeaders = (_rows: Row[]): boolean => {
            const wrongHeaders: (CellValue | null)[] = [];
            for (let i = 0; i < _rows.length; i++) {
                if (_rows[0][i] === null || typeof _rows[0][i] === 'string') {
                    continue;
                }
                wrongHeaders.push(_rows[0][i]);
            }

            if (wrongHeaders.length) {
                console.error('Wrong headers types\'s: ', wrongHeaders);
                this.notificationService.show(languagesService.transform('errors', 'good_file_5'), 'error');

                return false;
            }
            return true;
        };
        const typesCheck = (_rows: Row[]): Partial<IGood>[] | null => {
            const wrongTypes: Record<number, TAny> = {};

            const convertedObjects: TAnyObject[] = [];
            for (const row of _rows) {
                if (_rows.indexOf(row) === 0) {
                    continue;
                }

                const convertedObject: TAnyObject = {};
                for (let i = 0; i < row.length; i++) {
                    // presume that all headers are strings
                    convertedObject[_rows[0][i] as unknown as string] = row[i] === null ? undefined : row[i];
                }
                convertedObjects.push(convertedObject);
            }

            const result: Partial<IGood>[] = [];
            convertedObjects.forEach((obj: TAnyObject, index: number) => {
                try {
                    result.push(ZIGood.partial().parse(obj));
                } catch (e: unknown) {
                    wrongTypes[index] = e as TAny;
                }
            });

            if (Object.keys(wrongTypes).length) {
                console.error('Wrong types\'s: ', wrongTypes);
                this.notificationService.show(languagesService.transform('errors', 'good_file_5'), 'error');
                return null;
            }
            return result;
        };
        const filterNewGoods = (_newGoods: Partial<IGood>[]) => _newGoods
            .map((good: Partial<IGood>): IGoodTemplate | undefined => {
                const newGoodRequiredKeys: (keyof IGood)[] = [
                    'name',
                    'type',
                    'imageUrl',
                    'description',
                    'shortDescription',
                    'storage',
                    'storageType',
                    'nullPrice',
                    'sellPrice',
                    'wholePrice',
                    'wholeCount',
                ];
                const newGoodKeys: (keyof IGood)[] = Object.keys(good) as (keyof IGood)[];
                const missingKeys: string[] = [];
                newGoodRequiredKeys.forEach((key: keyof IGood) => {
                    if (!newGoodKeys.includes(key) || good[key] === undefined || good[key] === null) {
                        missingKeys.push(key);
                    }
                });
                const wrongNewGoods = new Map<Partial<IGood>, string>();
                if (missingKeys.length) {
                    wrongNewGoods.set(good, `Missing required keys: ${missingKeys.join(', ')}`);
                    this.notificationService.show(languagesService
                        .transform('errors', 'good_file_6') + `\n${good.id}`, 'error');
                    console.error(wrongNewGoods);
                    return undefined;
                }
                const missingKeysGood: Partial<IGood> = {};
                newGoodKeys.forEach((key: keyof Partial<IGood>) => {
                    try {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        missingKeysGood[key] = good[key];
                    } catch (e: unknown) {
                        console.error(e);
                    }
                });
                return {
                    ...emptyGoodTemplate,
                    ...missingKeysGood,
                };
            })
            .filter((good: IGoodTemplate | undefined) => good !== undefined);

        readXlsxFile(event.currentFiles[0])
            .then(async(rows: Row[]) => {
                if (![nullCheck, unknownCheck, lengthCheck, typesCheckHeaders]
                    .every((check: (_rows: Row[]) => boolean) => check(rows))) {
                    return;
                }
                const goods: Partial<IGood>[] | null = typesCheck(rows);
                if (!goods) {
                    return;
                }

                let updateGoods: Partial<IGood>[] = [];
                const newGoods: Partial<IGood>[] = [];
                goods.forEach((good: Partial<IGood>) => {
                    if (good.id) {
                        updateGoods.push(good);
                    } else {
                        newGoods.push(good);
                    }
                });

                const filteredNewGoods: IGoodTemplate[] = filterNewGoods(newGoods);

                if (updateGoods.length) {
                    updateGoods = updateGoods.map((good: Partial<IGood>) => {
                        if (this.storageService.goods().find((storageGood: IGood) => storageGood.id === good.id)) {
                            return good;
                        }
                        this.notificationService.show(languagesService
                            .transform('errors', 'good_file_7') + `\n${good.id}`, 'error');
                        console.error(good, `Wrong given ID: ${good.id}`);
                        return undefined;
                    }).filter((good: Partial<IGood> | undefined) => good !== undefined);
                }

                if (!filteredNewGoods.length && !updateGoods.length) {
                    this.notificationService.show(languagesService
                        .transform('errors', 'good_file_8'), 'error');
                    return;
                }

                if (filteredNewGoods.length) {
                    await this.apiService.createGoodBundle(filteredNewGoods)
                        .then((result: IGoodTemplate[]) => {
                            this.notificationService.show(languagesService
                                .transform('success', 'good_4') + result.length, 'success');
                        })
                        .catch(console.error)
                        .finally(() => {
                            this.storageService.fetchGoods();
                        });
                }

                if (updateGoods.length) {
                    this.apiService.updateGoodBundle(updateGoods)
                        .then((result: [][]) => {
                            this.notificationService.show(languagesService
                                .transform('success', 'good_5') + result.length, 'success');
                        })
                        .catch(console.error)
                        .finally(() => {
                            this.storageService.fetchGoods();
                        });
                }
            });
    }

    getAndSortGoodKeys() {
        const keys: (keyof IGood)[] = [
            'id',
            'imageUrl',
            'name',
            'type',
            'description',
            'shortDescription',
            'notes',
            'storage',
            'storageType',
            'nullPrice',
            'sellPrice',
            'deleted',
            'wholePrice',
            'wholeCount',
            'createdAt',
            'createdBy',
            'updatedAt',
            'updatedBy',
            'uniqueId',
            'uniqueCode',
            'priceHistory',
        ];
        if (keys.length !== Object.keys(emptyGood).length) {
            console.error('Keys do not match');
            return [];
        }
        return keys;
    }

}
