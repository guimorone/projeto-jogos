import { FC } from 'react';
import { Modal } from 'flowbite-react';
import demo from '../../assets/demo.gif'

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
        <Modal.Body className="overflow-x-hidden overflow-y-auto max-h-[70vh] space-y-4 text-zinc-100 text-base leading-relaxed" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div>
            <h1 style={{fontSize: '3rem'}}>Digite!! <span style={{fontSize: '2rem'}}>e rápido!</span></h1>
            <img src={demo} />
            <span>Palavras virão em sua direção! seu objetivo é digitá-las antes que elas cheguem no final da tela!</span>
            <br />
            <span>Palavras com acentuação valem mais pontos!</span>
            <br />
            <span>Destrua palavras <span style={{fontWeight: '700'}}>explosivas</span> para conseguir mais pontuação!</span>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default About;
