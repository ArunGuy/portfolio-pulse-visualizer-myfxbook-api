import React, { useState } from 'react';
import ReactModal from 'react-modal';
import dogSuitImage from '../assets/images/dog-suit2.png';
import bornfreImage from '../assets/images/bornfire3.jpeg';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useEmblaCarousel from 'embla-carousel-react';

ReactModal.setAppElement('#root');

const Index = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [emblaRef] = useEmblaCarousel({ loop: false });

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <div className="min-h-screen flex flex-col items-center bg-dark-blue-900 relative">
      <div className="flex-grow flex items-center justify-center">
        <img
          src={dogSuitImage}
          alt="Mascot"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="embla w-full max-w-4xl" ref={emblaRef}>
        <div className="embla__container flex">
          <div className="embla__slide flex-[0_0_100%] min-w-0 p-2">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl h-full">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">เกี่ยวกับเรา</h2>
              <p className="text-gray-300 mb-6">เรียนรู้เพิ่มเติมเกี่ยวกับทีมของเราและวิสัยทัศน์ในการลงทุน</p>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
                onClick={openModal}
              >
                อ่านเพิ่มเติม
              </Button>
            </div>
          </div>
          <div className="embla__slide flex-[0_0_100%] min-w-0 p-2">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl h-full flex items-center">
              <div className="w-1/2 h-64 flex items-center justify-center mr-8">
                <img
                  src={bornfreImage}
                  alt="BornFree"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="w-1/2">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">ประวัติของกลุ่ม Mhagutsfund</h2>
                <p className="text-gray-300 mb-6">เรียนรู้เกี่ยวกับจุดเริ่มต้น, ความหลากหลาย, และวิสัยทัศน์ของกลุ่มนักลงทุนที่มีความหลงใหลในโลกของการเงิน</p>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
                  onClick={openModal}
                >
                  อ่านเพิ่มเติม
                </Button>
              </div>
            </div>
          </div>
          <div className="embla__slide flex-[0_0_100%] min-w-0 p-2">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl h-full">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">บริการของเรา</h2>
              <p className="text-gray-300 mb-6">ค้นพบบริการต่างๆ ที่เรานำเสนอเพื่อช่วยคุณในการลงทุน</p>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
                onClick={openModal}
              >
                ดูบริการ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
        <DialogContent className="sm:max-w-[700px] bg-gray-800 text-white border-none">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">ประวัติของกลุ่ม Mhagutsfund</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Mhagutsfund เป็นกลุ่มเพื่อนที่มีความสนใจร่วมกันในด้านการลงทุน พวกเขารู้จักกันมานานกว่าทศวรรษและได้สร้างความสัมพันธ์อันแน่นแฟ้นผ่านความหลงใหลในโลกของการเงินและการลงทุน
              </p>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-blue-400">จุดเริ่มต้น</h3>
                <p className="text-gray-300">
                  กลุ่มนี้ก่อตั้งขึ้นโดยเพื่อนที่รู้จักกันมาประมาณ 10 กว่าปี พวกเขามีพื้นฐานความสนใจที่คล้ายคลึงกันในด้านการลงทุน แต่ก็มีความหลากหลายในรูปแบบการลงทุนที่แต่ละคนชื่นชอบ
                </p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-purple-400">ความหลากหลายในการลงทุน</h3>
                <p className="text-gray-300 mb-4">
                  สมาชิกในกลุ่ม Mhagutsfund มีความสนใจในการลงทุนที่หลากหลาย ครอบคลุมหลายประเภทสินทรัพย์และตลาด ได้แก่:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>คริปโตเคอร์เรนซี</li>
                  <li>ฟอเร็กซ์ (Forex)</li>
                  <li>กองทุนรวม</li>
                  <li>หุ้น</li>
                </ul>
              </div>
              <p className="text-lg leading-relaxed text-gray-300">
                ความหลากหลายนี้ช่วยให้กลุ่มมีมุมมองที่กว้างขวางในโลกของการลงทุน และสามารถแลกเปลี่ยนความรู้และประสบการณ์ที่หลากหลายระหว่างกัน
              </p>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-green-400">จุดเปลี่ยนสำคัญ</h3>
                <p className="text-gray-300">
                  แม้ว่าสมาชิกในกลุ่มจะมีความสนใจที่หลากหลาย แต่มีสมาชิก 2 คนที่มีความหลงใหลในตลาด Forex เป็นพิเศษ พวกเขาได้ทุ่มเทเวลาและความพยายามอย่างมากในการศึกษาและพัฒนาทักษะในการเทรด Forex จนกระทั่งสามารถสร้าง EA (Expert Advisor) เป็นของตัวเองได้
                </p>
              </div>
              <p className="text-lg leading-relaxed text-gray-300">
                การพัฒนา EA นี้ถือเป็นจุดเปลี่ยนสำคัญของกลุ่ม เนื่องจากเป็นการนำความรู้และประสบการณ์ที่สั่งสมมาสร้างเป็นเครื่องมือที่สามารถใช้งานได้จริงในการเทรด
              </p>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-yellow-400">การก่อตั้งเว็บไซต์</h3>
                <p className="text-gray-300 mb-4">
                  ด้วยความสำเร็จในการพัฒนา EA และความต้องการที่จะแบ่งปันความรู้และประสบการณ์ สมาชิกในกลุ่มจึงตัดสินใจสร้างเว็บไซต์ขึ้น โดยมีวัตถุประสงค์หลัก ดังนี้:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>แบ่งปันความรู้และประสบการณ์ในการลงทุนรูปแบบต่างๆ</li>
                  <li>นำเสนอ EA ที่พัฒนาขึ้นและแบ่งปันข้อมูลเกี่ยวกับการใช้งาน</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;