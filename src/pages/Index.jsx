import React, { useState } from 'react';
import ReactModal from 'react-modal';
import dogSuitImage from '../assets/images/dog-suit2.png';
import bornfreImage from '../assets/images/bornfire3.jpeg';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

ReactModal.setAppElement('#root');

const HistoryCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const historyItems = [
    {
      title: "จุดเริ่มต้น",
      content: "กลุ่มนี้ก่อตั้งขึ้นโดยเพื่อนที่รู้จักกันมาประมาณ 10 กว่าปี พวกเขามีพื้นฐานความสนใจที่คล้ายคลึงกันในด้านการลงทุน แต่ก็มีความหลากหลายในรูปแบบการลงทุนที่แต่ละคนชื่นชอบ"
    },
    {
      title: "ความหลากหลายในการลงทุน",
      content: "สมาชิกในกลุ่ม Mhagutsfund มีความสนใจในการลงทุนที่หลากหลาย ครอบคลุมหลายประเภทสินทรัพย์และตลาด ได้แก่: คริปโตเคอร์เรนซี, ฟอเร็กซ์ (Forex), กองทุนรวม, หุ้น"
    },
    {
      title: "จุดเปลี่ยนสำคัญ",
      content: "แม้ว่าสมาชิกในกลุ่มจะมีความสนใจที่หลากหลาย แต่มีสมาชิก 2 คนที่มีความหลงใหลในตลาด Forex เป็นพิเศษ พวกเขาได้ทุ่มเทเวลาและความพยายามอย่างมากในการศึกษาและพัฒนาทักษะในการเทรด Forex จนกระทั่งสามารถสร้าง EA (Expert Advisor) เป็นของตัวเองได้"
    },
    {
      title: "การก่อตั้งเว็บไซต์",
      content: "ด้วยความสำเร็จในการพัฒนา EA และความต้องการที่จะแบ่งปันความรู้และประสบการณ์ สมาชิกในกลุ่มจึงตัดสินใจสร้างเว็บไซต์ขึ้น โดยมีวัตถุประสงค์หลักคือแบ่งปันความรู้และประสบการณ์ในการลงทุนรูปแบบต่างๆ และนำเสนอ EA ที่พัฒนาขึ้นและแบ่งปันข้อมูลเกี่ยวกับการใช้งาน"
    }
  ];

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {historyItems.map((item, index) => (
            <div className="flex-[0_0_100%] min-w-0 pl-4" key={index}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-4 text-blue-400">{item.title}</h3>
                  <p className="text-gray-300">{item.content}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={scrollPrev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75">
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button onClick={scrollNext} className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75">
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};

const Index = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
      
      <div className="flex items-center bg-gray-800 p-6 rounded-xl shadow-2xl max-w-4xl w-full">
        <div className="w-1/2 h-64 flex items-center justify-center">
          <img
            src={bornfreImage}
            alt="BornFree"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="ml-8 flex flex-col text-white w-full">
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
              <HistoryCarousel />
              <p className="text-lg leading-relaxed text-gray-300">
                ความหลากหลายนี้ช่วยให้กลุ่มมีมุมมองที่กว้างขวางในโลกของการลงทุน และสามารถแลกเปลี่ยนความรู้และประสบการณ์ที่หลากหลายระหว่างกัน
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                การพัฒนา EA นี้ถือเป็นจุดเปลี่ยนสำคัญของกลุ่ม เนื่องจากเป็นการนำความรู้และประสบการณ์ที่สั่งสมมาสร้างเป็นเครื่องมือที่สามารถใช้งานได้จริงในการเทรด
              </p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;