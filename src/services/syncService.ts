import * as Network from 'expo-network';
import { db } from '../db/database';
import { Config } from '../config';

export class SyncService {
  private static SYNC_URL = Config.SYNC_URL;

  /**
   * Checks for internet connectivity and triggers sync if available.
   */
  static async startSync() {
    const network = await Network.getNetworkStateAsync();
    
    if (network.isConnected && network.isInternetReachable) {
      console.log('Sync initialized: Network detected');
      await this.syncAttempts();
    } else {
      console.log('Sync skipped: No internet connection');
    }
  }

  /**
   * Fetches unsynced attempts and sends them to the server.
   */
  private static async syncAttempts() {
    return new Promise<void>((resolve) => {
      // @ts-ignore
      db.transaction((tx: any) => {
        tx.executeSql(
          'SELECT * FROM attempts WHERE synced = 0 LIMIT 50',
          [],
          async (_: any, { rows }: any) => {
            if (rows.length === 0) {
              console.log('Nothing to sync');
              resolve();
              return;
            }

            const dataToSync = [];
            for (let i = 0; i < rows.length; i++) {
              dataToSync.push(rows.item(i));
            }

            try {
              console.log(`Syncing ${dataToSync.length} attempts to ${this.SYNC_URL}...`);
              
              const response = await fetch(this.SYNC_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  student_id: 1, // User ID from SQLite
                  attempts: dataToSync
                })
              });

              if (response.ok) {
                // Mark as synced locally only if server confirmed
                this.markAsSynced(dataToSync.map(a => a.id));
              } else {
                console.warn('Server rejected sync', response.status);
              }
              resolve();
            } catch (error) {
              console.error('Network error during sync (offline or server down)', error);
              resolve();
            }
          }
        );
      });
    });
  }

  /**
   * Marks records as synced in local DB.
   */
  private static markAsSynced(ids: number[]) {
    if (ids.length === 0) return;
    
    // @ts-ignore
    db.transaction((tx: any) => {
      const placeholders = ids.map(() => '?').join(',');
      tx.executeSql(
        `UPDATE attempts SET synced = 1 WHERE id IN (${placeholders})`,
        ids
      );
    });
    console.log(`${ids.length} attempts marked as synced.`);
  }
}
