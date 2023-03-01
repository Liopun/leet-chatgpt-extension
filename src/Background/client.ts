import Browser from 'webextension-polyfill';
import { ClientType, IClientCfgs, IGPT3ClientCfg } from '../interfaces';

const setClientCfgs = async (client: ClientType, cfgs: IClientCfgs['configs']) =>
  Browser.storage.local.set({
    client,
    [`client:${ClientType.GPT3}`]: cfgs[ClientType.GPT3],
  });

const getClientCfgs = async (): Promise<IClientCfgs> => {
  const { client = ClientType.ChatGPT } = await Browser.storage.local.get('client');
  const cfgKey = `client:${ClientType.GPT3}`;
  const res = await Browser.storage.local.get(cfgKey);

  const clientCfg = client as ClientType;
  const configsCfg = res[cfgKey] as IGPT3ClientCfg;

  return {
    client: clientCfg,
    configs: {
      [ClientType.GPT3]: configsCfg,
    },
  };
};

export { setClientCfgs, getClientCfgs };
