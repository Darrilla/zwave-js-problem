import path from 'path';
import { readFileSync } from 'fs';
import {
  Driver,
  ZWaveNode,
} from 'zwave-js';
import { randomBytes } from 'crypto';

export type ZwaveBridgeNetworkKey = {
  S2_Unauthenticated: string;
  S2_Authenticated: string;
  S2_AccessControl: string;
  S0_Legacy: string;
};

class ZWaveBridge {
  _driver?: Driver;

  networkKey: ZwaveBridgeNetworkKey | undefined;

  constructor() {
    Promise.resolve().then(async () => {
      const networkKeysCreations: Array<Promise<string>> = [];
      console.log('Generating Network Keys');
      for (let i = 0; i < 4; i++) {
        networkKeysCreations.push(new Promise<string>((resolve, reject) => {
          randomBytes(16, (err, buf) => {
            if (err) {
              reject(err);
            } else {
              resolve(buf.toString('hex'));
            }
          });
        }));
      }
      const networkKeys = await Promise.all(networkKeysCreations);
      console.log('Generated Network Keys');
      this.networkKey = {
        S2_Unauthenticated: networkKeys[0],
        S2_Authenticated: networkKeys[1],
        S2_AccessControl: networkKeys[2],
        S0_Legacy: networkKeys[3],
      };

      const securityKeys: any = {};

      const zWaveOptions = {
        storage: {
          cacheDir: path.normalize('/var/lib/falcon/zwave'),
        },
        securityKeys,
      };

      Object.entries(this.networkKey).forEach(([keyName, keyValue]) => {
        securityKeys[keyName] = Buffer.from(keyValue, 'hex');
      });
      this._driver = new Driver(
        '/dev/ttyS0',
        zWaveOptions,
      );

      this._driver.updateLogConfig({
        forceConsole: true,
      });
    }).catch();
  }
}
