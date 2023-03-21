import { FC } from 'react';
import { Modal } from 'flowbite-react';

interface IFuncProps {
  show: boolean;
  onClose: VoidFunction;
}

const About: FC<IFuncProps> = ({ show, onClose }: IFuncProps) => {
  return (
    <Modal show={show} onClose={onClose}>
      <div className="bg-neutral-800 rounded-md">
        <Modal.Header>
          <label className="text-teal-600">Tá, mas como funciona esse jogo?</label>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4 text-zinc-100 text-base leading-relaxed">
            <p>Instruções aqui kkk</p>
            <p>Testanto testando...</p>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default About;
