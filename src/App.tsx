import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Book as BookIcon, Edit2, Download, Upload, Printer, X } from 'lucide-react';
import { PageFlip } from 'page-flip';

// --- Types ---
type PageType = 'cover' | 'content';

interface PoemLine {
  chinese: string;
  pinyin: string;
}

interface BookPage {
  id: string;
  type: PageType;
  title?: string;
  pinyinTitle?: string;
  chineseLines?: PoemLine[];
  author?: string;
  pinyinAuthor?: string;
  note?: string;
  italianTitle?: string;
  italianLines?: string[];
  backgroundImage?: string;
}

// --- Utils ---
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// --- Components ---

const Book: React.FC<{ pages: BookPage[] }> = ({ pages }) => {
  const bookRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);

  useEffect(() => {
    if (!bookRef.current) return;

    if (flipRef.current) {
      try {
        flipRef.current.destroy();
      } catch (e) {}
      flipRef.current = null;
    }

    const timer = setTimeout(() => {
      if (!bookRef.current) return;

      try {
        const flip = new PageFlip(bookRef.current, {
          width: 400,
          height: 550,
          size: "fixed",
          minWidth: 300,
          maxWidth: 500,
          minHeight: 400,
          maxHeight: 650,
          showCover: true,
          mobileScrollSupport: true,
          maxShadowOpacity: 0.5,
          flippingTime: 800,
          usePortrait: false,
          startPage: 0,
          drawShadow: true,
          clickEventForward: true,
          useMouseEvents: true,
          swipeDistance: 30,
          showPageCorners: true,
          disableFlipByClick: false,
        });

        const pageElements = bookRef.current.querySelectorAll('.page');
        if (pageElements.length > 0) {
          flip.loadFromHTML(pageElements);
          flipRef.current = flip;
        }
      } catch (error) {
        console.error("Failed to initialize PageFlip:", error);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (flipRef.current) {
        try {
          flipRef.current.destroy();
        } catch (e) {}
        flipRef.current = null;
      }
    };
  }, [pages]);

  return (
    <div className="flex flex-col items-center min-h-[600px] w-full py-10 print:py-0">
      <div className="hidden print:block w-full space-y-8">
        {pages.map((page) => (
          <div key={page.id} className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm break-after-page">
             {page.type === 'cover' ? (
               <div 
                 className="text-center py-20 bg-[#2c3e50] text-white rounded-lg" 
                 style={{ 
                   backgroundImage: page.backgroundImage ? `url(${page.backgroundImage})` : 'none',
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 }}
               >
                 <div className="bg-black/30 p-10 rounded-lg backdrop-blur-sm inline-block">
                   <h1 className="text-5xl font-zhi-mang mb-4">{page.title}</h1>
                   <h2 className="text-2xl font-cormorant italic opacity-90">{page.italianTitle}</h2>
                 </div>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <h1 className="font-zhi-mang text-3xl text-[#2a1f15] text-center mb-2">
                      <ruby>
                        {page.title}
                        <rt className="font-long-cang text-xl text-[#8b7e6a] pb-2">{page.pinyinTitle}</rt>
                      </ruby>
                    </h1>
                    <div className="font-ma-shan text-4xl leading-[1.8] text-[#1f150f] text-center">
                      {page.chineseLines?.map((line, i) => (
                        <div key={i}>
                          <ruby>
                            {line.chinese}
                            <rt className="font-long-cang text-lg text-[#8b7e6a]">{line.pinyin}</rt>
                          </ruby>
                        </div>
                      ))}
                    </div>
                 </div>
                 <div className="space-y-6 border-l md:pl-8 border-gray-100">
                    <div className="text-center">
                      <h2 className="font-single-day text-sm text-red-600 mb-5 uppercase tracking-wider">
                        Traduzione italiana
                      </h2>
                      <div className="font-nanum text-lg leading-tight text-[#3a2a1a]">
                        <strong className="block text-[1.8em] mb-2 font-noto-sans">{page.italianTitle}</strong>
                        {page.italianLines?.map((line, i) => (
                          <p key={i} className="mb-1">{line}</p>
                        ))}
                      </div>
                    </div>
                 </div>
               </div>
             )}
          </div>
        ))}
      </div>

      <div ref={bookRef} className="book-container print:hidden">
        {pages.map((page, index) => {
          if (page.type === 'cover') {
            return (
              <div key={page.id} className="page cover" style={{ backgroundImage: page.backgroundImage ? `url(${page.backgroundImage})` : 'none' }}>
                <div className="text-center p-10 bg-black/20 backdrop-blur-[2px] rounded-xl">
                  <h1 className="text-4xl font-zhi-mang mb-4 text-white drop-shadow-lg">{page.title}</h1>
                  <h2 className="text-xl font-cormorant italic opacity-90 text-white drop-shadow-md">{page.italianTitle}</h2>
                </div>
              </div>
            );
          }
          return (
            <React.Fragment key={page.id}>
              <div className="page --left">
                <div className="flex flex-col items-center w-full h-full p-2">
                  {page.title && (
                    <h1 className="font-zhi-mang text-3xl text-[#2a1f15] text-center mb-2">
                      <ruby>
                        {page.title}
                        <rt className="font-long-cang text-xl text-[#8b7e6a] pb-2">{page.pinyinTitle}</rt>
                      </ruby>
                    </h1>
                  )}
                  <div className="font-ma-shan text-4xl leading-[1.8] text-[#1f150f] text-center mb-10">
                    {page.chineseLines?.map((line, i) => (
                      <div key={i}>
                        <ruby>
                          {line.chinese}
                          <rt className="font-long-cang text-lg text-[#8b7e6a]">{line.pinyin}</rt>
                        </ruby>
                        {i < (page.chineseLines?.length || 0) - 1 && <br />}
                      </div>
                    ))}
                  </div>
                  {page.author && (
                    <div className="mt-auto font-zhi-mang text-xl text-gray-500 text-center">
                      <ruby>
                        {page.author}
                        <rt className="font-long-cang text-base text-[#8b7e6a]">{page.pinyinAuthor}</rt>
                      </ruby>
                    </div>
                  )}
                </div>
                <div className="page-number">{index * 2 + 1}</div>
              </div>
              <div className="page --right">
                <div className="flex flex-col w-full h-full">
                  {page.note && (
                    <div className="relative max-w-[550px] mx-auto mb-10 p-2 border-l-2 border-[#d4c8a8] bg-[rgba(255,252,245,0.6)]">
                      <span className="absolute -top-3 left-4 bg-[#fefdf9] px-2 font-single-day text-[10px] text-[#b8a89d] uppercase">
                        Nota dell'autore
                      </span>
                      <p className="font-long-cang text-xl text-[#5a4a3a] leading-tight">
                        "{page.note}"
                      </p>
                    </div>
                  )}
                  <div className="text-center max-w-[400px] mx-auto">
                    <h2 className="font-single-day text-sm text-red-600 mb-5 uppercase tracking-wider">
                      Traduzione italiana
                    </h2>
                    <div className="font-nanum text-lg leading-tight text-[#3a2a1a]">
                      <strong className="block text-[1.8em] mb-2 font-noto-sans">{page.italianTitle}</strong>
                      {page.italianLines?.map((line, i) => (
                        <p key={i} className="mb-1">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="page-number">{index * 2 + 2}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const INITIAL_PAGES: BookPage[] = [
  {
    id: 'cover-1',
    type: 'cover',
    title: 'Libro Cinese-Italiano',
    italianTitle: 'Poesie e Racconti',
    backgroundImage: '/cover.png'
  },
  {
    id: 'page-1',
    type: 'content',
    title: '赋得古原草送别',
    pinyinTitle: 'fù dé gǔ yuán cǎo sòng bié',
    chineseLines: [
      { chinese: '离离原上草', pinyin: 'lí lí yuán shàng cǎo' },
      { chinese: '一岁一枯荣', pinyin: 'yī suì yī kū róng' },
      { chinese: '野火烧不尽', pinyin: 'yě huǒ shāo bù jìn' },
      { chinese: '春风吹又生', pinyin: 'chūn fēng chuī yòu shēng' }
    ],
    author: '白居易',
    pinyinAuthor: 'bái jū yì',
    note: 'Questa poesia parla della resilienza della natura.',
    italianTitle: 'L\'erba della pianura',
    italianLines: [
      'Lussureggiante l\'erba sulla pianura,',
      'Ogni anno appassisce e rifiorisce.',
      'Il fuoco selvaggio non può consumarla del tutto,',
      'Il vento di primavera soffia e rinasce.'
    ]
  }
];

export default function App() {
  const [pages, setPages] = useState<BookPage[]>(INITIAL_PAGES);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<BookPage | null>(null);

  const handleExportHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Libro Cinese-Italiano - Interattivo</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Long+Cang&family=Ma+Shan+Zheng&family=Noto+Sans+SC:wght@100..900&family=Single+Day&family=Nanum+Brush+Script&family=Zhi+Mang+Xing&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { 
            background-color: #f5f0e6; 
            margin: 0; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center; 
            min-height: 100vh;
            font-family: 'Noto Sans SC', sans-serif;
        }
        .font-zhi-mang { font-family: 'Zhi Mang Xing', cursive; }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-long-cang { font-family: 'Long Cang', cursive; }
        .font-ma-shan { font-family: 'Ma Shan Zheng', cursive; }
        .font-single-day { font-family: 'Single Day', cursive; }
        .font-nanum { font-family: 'Nanum Brush Script', cursive; }

        .book-container {
            box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }

        .page {
            background-color: #fdfaf6;
            padding: 40px;
            border: 1px solid #e0d8c8;
            box-sizing: border-box;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .page.--left {
            box-shadow: inset -10px 0 20px rgba(0,0,0,0.05);
            border-right: 1px solid #d4cbb8;
        }

        .page.--right {
            box-shadow: inset 10px 0 20px rgba(0,0,0,0.05);
            border-left: 1px solid #d4cbb8;
        }

        .cover {
            background-color: #2c3e50;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-size: cover;
            background-position: center;
        }

        .page-number {
            position: absolute;
            bottom: 20px;
            font-size: 12px;
            color: #8b7e6a;
        }
        .page.--left .page-number { left: 20px; }
        .page.--right .page-number { right: 20px; }

        ruby rt { 
            font-family: 'Long Cang', cursive; 
            color: #8b7e6a; 
            font-size: 0.5em;
        }

        .author-note {
            border-left: 3px solid #d4c8a8;
            background: rgba(255,252,245,0.8);
            padding: 10px;
            margin-bottom: 20px;
            font-family: 'Long Cang', cursive;
            font-size: 1.2rem;
            color: #5a4a3a;
        }
    </style>
</head>
<body>
    <div id="book" class="book-container">
        ${pages.map((page, index) => {
            if (page.type === 'cover') {
                return `
                    <div class="page cover" style="background-image: ${page.backgroundImage ? `url(${page.backgroundImage})` : 'none'}">
                        <div class="text-center p-10 bg-black/20 backdrop-blur-[2px] rounded-xl">
                            <h1 class="text-4xl font-zhi-mang mb-4 text-white">${page.title || ''}</h1>
                            <h2 class="text-xl font-cormorant italic opacity-90 text-white">${page.italianTitle || ''}</h2>
                        </div>
                    </div>
                `;
            }
            return `
                <div class="page --left">
                    <div class="flex flex-col items-center w-full h-full">
                        <h1 class="font-zhi-mang text-3xl mb-4">
                            <ruby>${page.title || ''}<rt>${page.pinyinTitle || ''}</rt></ruby>
                        </h1>
                        <div class="font-ma-shan text-4xl leading-relaxed text-center my-auto">
                            ${page.chineseLines?.map(line => `<div><ruby>${line.chinese}<rt>${line.pinyin}</rt></ruby></div>`).join('')}
                        </div>
                        ${page.author ? `<div class="mt-auto font-zhi-mang text-xl text-gray-500"><ruby>${page.author}<rt>${page.pinyinAuthor || ''}</rt></ruby></div>` : ''}
                    </div>
                    <div class="page-number">${index * 2 + 1}</div>
                </div>
                <div class="page --right">
                    <div class="flex flex-col h-full">
                        ${page.note ? `<div class="author-note">"${page.note}"</div>` : ''}
                        <div class="text-center my-auto">
                            <h2 class="text-red-600 text-xs uppercase tracking-widest mb-4 font-single-day">Traduzione Italiana</h2>
                            <h3 class="text-2xl font-bold mb-4">${page.italianTitle || ''}</h3>
                            <div class="font-nanum text-2xl leading-snug">
                                ${page.italianLines?.map(line => `<p class="mb-1">${line}</p>`).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="page-number">${index * 2 + 2}</div>
                </div>
            `;
        }).join('')}
    </div>

    <script>
        window.onload = () => {
            const pageFlip = new St.PageFlip(document.getElementById('book'), {
                width: 400,
                height: 550,
                size: "fixed",
                showCover: true,
                maxShadowOpacity: 0.5,
                showPageCorners: true
            });
            pageFlip.loadFromHTML(document.querySelectorAll('.page'));
        };
    </script>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'libro_cinese_italiano.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(pages, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'libro_cinese_italiano.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedPages = JSON.parse(e.target?.result as string);
        setPages(importedPages);
      } catch (err) {
        alert("Errore nell'importazione del file.");
      }
    };
    reader.readAsText(file);
  };

  const handleAddPage = () => {
    const newPage: BookPage = {
      id: `page-${Date.now()}`,
      type: 'content',
      title: '',
      pinyinTitle: '',
      chineseLines: [{ chinese: '', pinyin: '' }],
      italianTitle: '',
      italianLines: ['']
    };
    setEditingPage(newPage);
    setIsEditorOpen(true);
  };

  const handleSavePage = (page: BookPage) => {
    if (pages.find(p => p.id === page.id)) {
      setPages(pages.map(p => p.id === page.id ? page : p));
    } else {
      setPages([...pages, page]);
    }
    setIsEditorOpen(false);
    setEditingPage(null);
  };

  const handleDeletePage = (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questa pagina?")) {
      setPages(pages.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#2c3e50] font-noto-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-[#d4cbb8] sticky top-0 z-10 px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#2c3e50] p-2 rounded-lg">
              <BookIcon className="text-white size-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Libro Cinese-Italiano</h1>
              <p className="text-xs text-muted-foreground">Creatore di poesie e racconti bilingue</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleAddPage} className="flex items-center gap-2 bg-[#2c3e50] text-white px-4 py-2 rounded-lg hover:bg-[#34495e] transition-colors text-sm font-medium">
              <Plus className="size-4" /> Aggiungi Pagina
            </button>
            <button onClick={handleExportHTML} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600" title="Esporta HTML">
              <Download className="size-5" />
            </button>
            <button onClick={handleExportJSON} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Esporta JSON">
              <Download className="size-5" />
            </button>
            <label className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" title="Importa JSON">
              <Upload className="size-5" />
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button onClick={() => window.print()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Stampa / PDF">
              <Printer className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <Book pages={pages} />
        
        <section className="mt-20 print:hidden">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Edit2 className="size-5" /> Gestione Pagine
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page, idx) => (
              <div key={page.id} className="bg-white border border-[#d4cbb8] rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold size-6 flex items-center justify-center rounded-full">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm truncate max-w-[150px]">
                      {page.type === 'cover' ? 'Copertina' : (page.title || 'Senza titolo')}
                    </p>
                    <p className="text-xs text-muted-foreground italic truncate max-w-[150px]">
                      {page.italianTitle || 'No traduzione'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingPage(page); setIsEditorOpen(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                    <Edit2 className="size-4" />
                  </button>
                  {page.type !== 'cover' && (
                    <button onClick={() => handleDeletePage(page.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Modifica Pagina</h3>
              <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              {editingPage?.type === 'cover' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Immagine di Copertina</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="text"
                        className="flex-1 border rounded-lg px-3 py-2 text-sm" 
                        placeholder="URL immagine o percorso..."
                        value={editingPage?.backgroundImage || ''} 
                        onChange={e => setEditingPage({...editingPage!, backgroundImage: e.target.value})}
                      />
                      <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors flex items-center gap-2">
                        <Upload className="size-4" /> Carica
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setEditingPage({...editingPage!, backgroundImage: event.target?.result as string});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {editingPage?.backgroundImage && (
                      <div className="mt-2 relative w-32 h-44 rounded-lg overflow-hidden border shadow-sm">
                        <img src={editingPage.backgroundImage} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                          onClick={() => setEditingPage({...editingPage!, backgroundImage: ''})}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titolo Cinese</label>
                  <input 
                    className="w-full border rounded-lg px-3 py-2" 
                    value={editingPage?.title || ''} 
                    onChange={e => setEditingPage({...editingPage!, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pinyin Titolo</label>
                  <input 
                    className="w-full border rounded-lg px-3 py-2" 
                    value={editingPage?.pinyinTitle || ''} 
                    onChange={e => setEditingPage({...editingPage!, pinyinTitle: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Linee Cinesi (Cinese | Pinyin)</label>
                {editingPage?.chineseLines?.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      className="flex-1 border rounded-lg px-3 py-2" 
                      placeholder="Cinese"
                      value={line.chinese} 
                      onChange={e => {
                        const newLines = [...(editingPage.chineseLines || [])];
                        newLines[i].chinese = e.target.value;
                        setEditingPage({...editingPage, chineseLines: newLines});
                      }}
                    />
                    <input 
                      className="flex-1 border rounded-lg px-3 py-2" 
                      placeholder="Pinyin"
                      value={line.pinyin} 
                      onChange={e => {
                        const newLines = [...(editingPage.chineseLines || [])];
                        newLines[i].pinyin = e.target.value;
                        setEditingPage({...editingPage, chineseLines: newLines});
                      }}
                    />
                    <button onClick={() => {
                      const newLines = editingPage.chineseLines?.filter((_, idx) => idx !== i);
                      setEditingPage({...editingPage, chineseLines: newLines});
                    }} className="p-2 text-red-500">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setEditingPage({...editingPage!, chineseLines: [...(editingPage?.chineseLines || []), {chinese: '', pinyin: ''}]})}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Aggiungi riga cinese
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Titolo Italiano</label>
                <input 
                  className="w-full border rounded-lg px-3 py-2" 
                  value={editingPage?.italianTitle || ''} 
                  onChange={e => setEditingPage({...editingPage!, italianTitle: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Linee Italiane</label>
                {editingPage?.italianLines?.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <textarea 
                      className="flex-1 border rounded-lg px-3 py-2" 
                      value={line} 
                      onChange={e => {
                        const newLines = [...(editingPage.italianLines || [])];
                        newLines[i] = e.target.value;
                        setEditingPage({...editingPage, italianLines: newLines});
                      }}
                    />
                    <button onClick={() => {
                      const newLines = editingPage.italianLines?.filter((_, idx) => idx !== i);
                      setEditingPage({...editingPage, italianLines: newLines});
                    }} className="p-2 text-red-500">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setEditingPage({...editingPage!, italianLines: [...(editingPage?.italianLines || []), '']})}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Aggiungi riga italiana
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Autore (Cinese)</label>
                  <input 
                    className="w-full border rounded-lg px-3 py-2" 
                    placeholder="es. 白居易"
                    value={editingPage?.author || ''} 
                    onChange={e => setEditingPage({...editingPage!, author: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Autore (Pinyin)</label>
                  <input 
                    className="w-full border rounded-lg px-3 py-2" 
                    placeholder="es. bái jū yì"
                    value={editingPage?.pinyinAuthor || ''} 
                    onChange={e => setEditingPage({...editingPage!, pinyinAuthor: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nota dell'Autore (Italiano)</label>
                <textarea 
                  className="w-full border rounded-lg px-3 py-2 min-h-[100px]" 
                  placeholder="Inserisci una nota o un commento alla poesia..."
                  value={editingPage?.note || ''} 
                  onChange={e => setEditingPage({...editingPage!, note: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsEditorOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                Annulla
              </button>
              <button onClick={() => handleSavePage(editingPage!)} className="px-4 py-2 text-sm font-medium text-white bg-[#2c3e50] hover:bg-[#34495e] rounded-lg transition-colors">
                Salva Pagina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
