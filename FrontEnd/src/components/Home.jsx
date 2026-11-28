
import { useState, useRef } from "react";
import Show from "./service/Show";

export default function Home() {
  const [text, setText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState(null);

  const showRef = useRef(null);

  const categories = [
    "งานทั้งหมด",
    "ไฟฟ้า",
    "ประปา",
    "ปรับอากาศ",
    "ทาสี",
    "โครงสร้าง",
    "เฟอร์นิเจอร์",
    "ทำความสะอาด",
    "อื่นๆ",
  ];

  const handleSelect = (item) => {
    setSelectedItem(item);
    setSearchText(null);
  };

  const handleSearch = () => {
    setSelectedItem(null);
    setSearchText(text.trim());

    setTimeout(() => {
      showRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <>
      <div className="HomeHeader">
        <section className="hero">
         <div className="Name_Banner">
          <img
            src="/images/FixChang.png"
            alt="Fix Chang"
            className="Image_Header"
          />
            <span className="Fix">Fix</span>
            <span className="Chang">Chang</span>
            </div>
          <div className="hero-text">
            <h1>หาช่างง่าย ๆ จบทุกงานซ่อม ใกล้บ้านคุณ</h1>
            <p>ค้นหาช่างมืออาชีพ พร้อมให้บริการคุณ</p>

            <div className="hero-search">
              <input
                type="text"
                className="i3"
                placeholder="ค้นหาบริการ..."
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>
          </div>
        </section>
      </div>

      <div ref={showRef} className="service-section">
        <p className="f1">เลือกประเภท</p>

        <div className="job-scroll">
          {categories.map((item) => (
            <button
              className={`button2 ${
                selectedItem === item ? "active" : ""
              }`}
              key={item}
              onClick={() => handleSelect(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <section className="show">
          <div className="show-content">
            {(selectedItem || searchText) && (
              <button
                className="buttonRed"
                onClick={() => {
                  setSelectedItem(null);
                  setSearchText(null);
                  setText("");
                }}
              >
                X
              </button>
            )}

            <Show
              category={selectedItem}
              searchText={searchText}
            />
          </div>
        </section>
      </div>
    </>
  );
}
