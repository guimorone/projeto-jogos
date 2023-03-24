import { FC, ReactElement, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import Timer from '../Timer';
import Template from './Template';
import type { GameStatusOptions, TitleType, StatusType } from '../../@types';

interface IFuncProps {
  props: TitleType & StatusType;
}

const GameStatusComponent: FC<IFuncProps> = ({ props }: IFuncProps) => {
  const components: { [key in GameStatusOptions]?: ReactElement } | any = {
    newLevel: (
      <div className="space-y-20">
        <h1 className="text-7xl tracking-wider font-medium italic">Prepare-se</h1>
        <div className="text-7xl tracking-wider font-medium text-rose-500 motion-safe:animate-ping">
          <Timer initialSeconds={props?.initialSeconds} />
        </div>
      </div>
    ),
    victory: <Template status="victory" props={props} />,
    defeat: <Template status="defeat" props={props} />,
    gameOver: <Template status="gameOver" props={props} />,
  };

  if (!(props.status in components) || !components[props.status]) return null;

  return (
    <Transition
      appear
      show
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="overflow-auto fixed p-0 -my-2.5 -mx-1.5 top-0 left-0 flex flex-col items-center justify-center w-full h-full min-w-[100vw] max-w-[100vw] min-h-screen max-h-screen  z-50 bg-zinc-700 bg-opacity-60 text-center">
        {components[props.status]}
      </div>
    </Transition>
  );
};

export default GameStatusComponent;
