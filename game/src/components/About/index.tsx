import { Modal } from 'flowbite-react';

export default function About({ show, onClose }: { show: boolean; onClose: VoidFunction }) {
  return (
    <Modal show={show} onClose={onClose}>
      <div className="bg-neutral-800 rounded-md">
        <Modal.Header>
          <h1 className="text-teal-600">Tá, mas como funciona esse jogo?</h1>
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
}
