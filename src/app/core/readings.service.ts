import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { getDeviceId } from './device-id';
import type { Reading, ReadingInput } from './models';

@Injectable({ providedIn: 'root' })
export class ReadingsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/readings`;
  private readonly deviceId = getDeviceId();

  readonly history = signal<Reading[]>([]);
  readonly loading = signal(false);
  readonly loadError = signal(false);

  async record(input: Omit<ReadingInput, 'deviceId'>): Promise<void> {
    try {
      const created = await firstValueFrom(
        this.http.post<Reading>(this.baseUrl, { ...input, deviceId: this.deviceId }),
      );
      this.history.update((readings) => [created, ...readings]);
    } catch {
      // Recording history is a nice-to-have; a failed write must never block the reading itself.
    }
  }

  async loadHistory(): Promise<void> {
    this.loading.set(true);
    try {
      const readings = await firstValueFrom(
        this.http.get<Reading[]>(this.baseUrl, { params: { deviceId: this.deviceId } }),
      );
      this.history.set(readings);
      this.loadError.set(false);
    } catch {
      this.loadError.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
