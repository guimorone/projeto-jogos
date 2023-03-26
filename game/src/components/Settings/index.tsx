import { useState, useEffect, FC, Dispatch, SetStateAction } from 'react';
import { Modal, Tooltip } from 'flowbite-react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import ToggleComponent from '../utils/ToggleComponent';
import type { PercentageType } from '../../@types';
import type { ConfigType } from '../../@types/settings';

interface IFuncProps {
  show: boolean;
  onClose: VoidFunction;
  volume: {
    value: ConfigType['volume'];
    setValue: Dispatch<SetStateAction<ConfigType['volume']>>;
  };
  diagonalWords: {
    value: ConfigType['diagonalWords'];
    setValue: Dispatch<SetStateAction<ConfigType['diagonalWords']>>;
  };
  considerNonNormalizedWords: {
    value: ConfigType['considerNonNormalizedWords'];
    setValue: Dispatch<SetStateAction<ConfigType['considerNonNormalizedWords']>>;
  };
}

const Settings: FC<IFuncProps> = ({ show, onClose, volume, diagonalWords, considerNonNormalizedWords }: IFuncProps) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(Boolean(document.fullscreenElement));

  useEffect(() => {
    const onFullscreenChange = (): void => setIsFullScreen(Boolean(document.fullscreenElement));

    document.addEventListener<'fullscreenchange'>('fullscreenchange', onFullscreenChange);

    return () => document.removeEventListener<'fullscreenchange'>('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    if (isFullScreen && !document.fullscreenElement) document.documentElement.requestFullscreen();
    else if (!isFullScreen && document.fullscreenElement) document.exitFullscreen();
  }, [isFullScreen]);

  return (
    <Modal show={show} onClose={onClose} size="2xl">
      <div className="bg-neutral-800 rounded-md">
        <Modal.Header>
          <label className="text-fuchsia-600">Configurações</label>
        </Modal.Header>
        <Modal.Body className="overflow-x-hidden overflow-y-auto max-h-[70vh] space-y-10 text-zinc-100 text-base leading-relaxed">
          <div className="space-y-4 text-lg">
            <h2 className="text-4xl font-semibold">Geral</h2>
            <div className="grid grid-cols-2">
              <div className="space-y-1">
                <p>Tela cheia</p>
                <ToggleComponent checked={isFullScreen} onChange={setIsFullScreen} />
              </div>
              <div className="space-y-1">
                <h4>Volumes</h4>
                <p className="text-base pt-1.5">Música</p>
                <input
                  type="range"
                  className="accent-fuchsia-600 hover:cursor-pointer w-5/6"
                  value={volume.value.music}
                  min={0}
                  max={100}
                  step={1}
                  onChange={({ target }) =>
                    volume.setValue(prev => ({ ...prev, music: parseInt(target.value) as PercentageType }))
                  }
                />
                <p className="text-base">Efeitos sonoros</p>
                <input
                  type="range"
                  className="accent-fuchsia-600 hover:cursor-pointer w-5/6"
                  value={volume.value.soundEffects}
                  min={0}
                  max={100}
                  step={1}
                  onChange={({ target }) =>
                    volume.setValue(prev => ({ ...prev, soundEffects: parseInt(target.value) as PercentageType }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="space-y-4 text-lg">
            <h2 className="text-4xl font-semibold">Jogabilidade</h2>
            <div className="grid grid-cols-2">
              <div className="space-y-1">
                <p>Palavras na diagonal</p>
                <ToggleComponent checked={diagonalWords.value} onChange={diagonalWords.setValue} />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-x-1">
                  <p>Considerar sinais diacríticos</p>
                  <Tooltip
                    content="Os sinais diacríticos do português são a cedilha (ç), os acentos gráficos (agudo e circunflexo), o til e, até pouco tempo atrás, o hoje extinto trema"
                    trigger="hover"
                    placement="auto"
                    className="w-2/3"
                  >
                    <InformationCircleIcon
                      aria-hidden={true}
                      className="w-6 h-6 text-fuchsia-600 bg- hover:cursor-pointer hover:opacity-70"
                    />
                  </Tooltip>
                </div>

                <ToggleComponent
                  checked={considerNonNormalizedWords.value}
                  onChange={considerNonNormalizedWords.setValue}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default Settings;
