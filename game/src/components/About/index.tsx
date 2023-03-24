import { FC } from 'react';
import { Modal } from 'flowbite-react';

interface IFuncProps {
  show: boolean;
  onClose: VoidFunction;
}

const About: FC<IFuncProps> = ({ show, onClose }: IFuncProps) => {
  return (
    <Modal show={show} onClose={onClose} size="4xl">
      <div className="bg-neutral-800 rounded-md">
        <Modal.Header>
          <label className="text-teal-600">Tá, mas como funciona esse jogo?</label>
        </Modal.Header>
        <Modal.Body className="overflow-x-hidden overflow-y-auto max-h-[70vh] space-y-4 text-zinc-100 text-base leading-relaxed">
          <div>
            <p>Instruções aqui kkk</p>
            <p>Testanto testando...</p>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default About;
