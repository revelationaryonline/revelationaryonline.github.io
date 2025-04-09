import React, { useState } from "react";
import { IconButton, Modal, Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { VideoCall } from "@mui/icons-material";

import TBPLogo from "../../assets/BP_mono-wht.png";
import TBPLogoSQ from "../../assets/BP_square-mono-wht.png";
// Define the structure of the video sources object
interface VideoSources {
  [book: string]: {
    [chapter: number]: string;
  };
}

// Object containing video sources from The Bible Project - YouTube Channel mapped by book and chapter
// https://bibleproject.com/ - https://www.youtube.com/user/jointhebibleproject
const videoSources: VideoSources = {
  genesis: {
    // 1-11
    1: "https://www.youtube-nocookie.com/embed/GQI72THyO5I?si=zbWixZDFtB_GBJjE&controls=0",
    // 12-50
    12: "https://www.youtube-nocookie.com/embed/F4isSyennFo?si=-gNKc8GuD-iIeb0Q&controls=0",
  },
  exodus: {
    // 1-18
    1: "https://www.youtube-nocookie.com/embed/jH_aojNJM3E?si=r5RjNuqvfgShPK_O&amp;controls=0",
    // 19-40
    19: "https://www.youtube-nocookie.com/embed/oNpTha80yyE?si=fWjF7HjkM4BadpWP&amp;controls=0",
  },
  leviticus: {
    1: "https://www.youtube-nocookie.com/embed/IJ-FekWUZzE?si=qV0cHZ6DXlEm1caM&amp;controls=0",
  },
  numbers: {
    1: "https://www.youtube-nocookie.com/embed/tp5MIrMZFqo?si=X8hiYnnPH8DsAee3&amp;controls=0",
  },
  deuteronomy: {
    1: "https://www.youtube-nocookie.com/embed/q5QEH9bH8AU?si=vWd_6GHZZrcPobod&amp;controls=0",
  },
  joshua: {
    1: "https://www.youtube-nocookie.com/embed/JqOqJlFF_eU?si=j-uakK58wmNTSDNn&amp;controls=0",
  },
  judges: {
    1: "https://www.youtube-nocookie.com/embed/kOYy8iCfIJ4?si=e1MXR8Ud8Ky63Dx3&amp;controls=0",
  },
  ruth: {
    1: "https://www.youtube-nocookie.com/embed/0h1eoBeR4Jk?si=lfxYaNbUy7GHE09t&amp;controls=0",
  },
  firstsamuel: {
    1: "https://www.youtube-nocookie.com/embed/QJOju5Dw0V0?si=vtE-hkKFJbkujicT&amp;controls=0",
  },
  secondsamuel: {
    1: "https://www.youtube-nocookie.com/embed/YvoWDXNDJgs?si=gcrggc8IfyHc2RJO&amp;controls=0",
  },
  firstkings: {
    1: "https://www.youtube-nocookie.com/embed/bVFW3wbi9pk?si=HOUqzcMAlsJnEEI2&amp;controls=0",
  },
  secondkings: {
    1: "https://www.youtube-nocookie.com/embed/bVFW3wbi9pk?si=HOUqzcMAlsJnEEI2&amp;controls=0",
  },
  firstchronicles: {
    1: "https://www.youtube-nocookie.com/embed/HR7xaHv3Ias?si=EydK9ckzc1K8G8pB&amp;controls=0",
  },
  secondchronicles: {
    1: "https://www.youtube-nocookie.com/embed/HR7xaHv3Ias?si=EydK9ckzc1K8G8pB&amp;controls=0",
  },
  ezra: {
    1: "https://www.youtube-nocookie.com/embed/MkETkRv9tG8?si=UrkiBnOiJzZxo57X&amp;controls=0",
  },
  nehemiah: {
    1: "https://www.youtube-nocookie.com/embed/MkETkRv9tG8?si=UrkiBnOiJzZxo57X&amp;controls=0",
  },
  esther: {
    1: "https://www.youtube-nocookie.com/embed/JydNSlufRIs?si=JEq8El_iJ9EgTXYq&amp;controls=0",
  },
  job: {
    1: "https://www.youtube-nocookie.com/embed/xQwnH8th_fs?si=b3dYkByEqJNDRKV-&amp;controls=0",
  },
  psalms: {
    1: "https://www.youtube-nocookie.com/embed/j9phNEaPrv8?si=lzufKTYfRACD0nJt&amp;controls=0",
  },
  proverbs: {
    1: "https://www.youtube-nocookie.com/embed/AzmYV8GNAIM?si=sjFG5fIOa9tjF1xr&amp;controls=0",
  },
  ecclesiastes: {
    1: "https://www.youtube-nocookie.com/embed/lrsQ1tc-2wk?si=8n_uV53bJjVm3QRe&amp;controls=0",
  },
  solomon: {
    1: "https://www.youtube-nocookie.com/embed/4KC7xE4fgOw?si=dCIKToCo-8zXIz5T&amp;controls=0",
  },
  isaiah: {
    1: "https://www.youtube-nocookie.com/embed/_TzdEPuqgQg?si=ZRn_TtVyL57tlK1H&amp;controls=0",
  },
  jeremiah: {
    1: "https://www.youtube-nocookie.com/embed/RSK36cHbrk0?si=5Pncmy3eb9iNwq0l&amp;controls=0",
  },
  lamentations: {
    1: "https://www.youtube-nocookie.com/embed/p8GDFPdaQZQ?si=F8pSUMEauywPrt5b&amp;controls=0",
  },
  ezekiel: {
    1: "https://www.youtube-nocookie.com/embed/SDeCWW_Bnyw?si=QCTTH1F5rdSkn2hC&amp;controls=0",
  },
  daniel: {
    1: "https://www.youtube-nocookie.com/embed/9cSC9uobtPM?si=mc20j9laYsbubI5W&amp;controls=0",
  },
  hosea: {
    1: "https://www.youtube-nocookie.com/embed/kE6SZ1ogOVU?si=IPOphUBp_gIW1w81&amp;controls=0",
  },
  joel: {
    1: "https://www.youtube-nocookie.com/embed/zQLazbgz90c?si=JO5rOk6H9x_1wuM9&amp;controls=0",
  },
  amos: {
    1: "https://www.youtube-nocookie.com/embed/mGgWaPGpGz4?si=9GX9NUmVO3DX-oKL&amp;controls=0",
  },
  obadiah: {
    1: "https://www.youtube-nocookie.com/embed/i4ogCrEoG5s?si=CCGlVew2fqnVcQFV&amp;controls=0",
  },
  jonah: {
    1: "https://www.youtube-nocookie.com/embed/dLIabZc0O4c?si=ulUqQaBFjsKZhKnu&amp;controls=0",
  },
  micah: {
    1: "https://www.youtube-nocookie.com/embed/MFEUEcylwLc?si=hscarI4ufYbCGw4h&amp;controls=0",
  },
  nahum: {
    1: "https://www.youtube-nocookie.com/embed/Y30DanA5EhU?si=OVzuq8zZkqw5HuOs&amp;controls=0",
  },
  habakkuk: {
    1: "https://www.youtube-nocookie.com/embed/OPMaRqGJPUU?si=JU64m24jxDPTepBG&amp;controls=0",
  },
  zephaniah: {
    1: "https://www.youtube-nocookie.com/embed/oFZknKPNvz8?si=jirKPvSpHTu8emQt&amp;controls=0",
  },
  haggai: {
    1: "https://www.youtube-nocookie.com/embed/juPvv_xcX-U?si=DpDnYHmyFGXC8The&amp;controls=0",
  },
  zechariah: {
    1: "https://www.youtube-nocookie.com/embed/_106IfO6Kc0?si=x8skTeoSz59iY3FL&amp;controls=0",
  },
  malachi: {
    1: "https://www.youtube-nocookie.com/embed/HPGShWZ4Jvk?si=ucIbreEhBG1gkGDd&amp;controls=0",
  },
  matthew: {
    // 1-14
    1: "https://www.youtube-nocookie.com/embed/3Dv4-n6OYGI?si=i10t341NmW48_OS3&amp;controls=0",
    // 14-28
    14: "https://www.youtube-nocookie.com/embed/GGCF3OPWN14?si=igFEAqHD5omEec-7&amp;controls=0",
  },
  mark: {
    1: "https://www.youtube-nocookie.com/embed/HGHqu9-DtXk?si=n6MyF2k2DeAgdOTt&amp;controls=0",
  },
  luke: {
    // 1-9
    1: "https://www.youtube-nocookie.com/embed/XIb_dCIxzr0?si=Ue4jNUytjiT_fNcl&amp;controls=0",
    // 10-24
    10: "https://www.youtube-nocookie.com/embed/26z_KhwNdD8?si=_7yY524NF0SbtjdI&amp;controls=0",
  },
  john: {
    // 1-12
    1: "https://www.youtube-nocookie.com/embed/G-2e9mMf7E8?si=HO5oDp72Uv472svr&amp;controls=0",
    // 13-21
    13: "https://www.youtube-nocookie.com/embed/RUfh_wOsauk?si=aLj4H-MS1XCj5Mjw&amp;controls=0",
  },
  acts: {
    // 1-12
    1: "https://www.youtube-nocookie.com/embed/CGbNw855ksw?si=2MBuzo0UbkcucUQe&amp;controls=0",
    // 13-28
    13: "https://www.youtube-nocookie.com/embed/Z-17KxpjL0Q?si=b6TFKtPQ8aCa8zde&amp;controls=0",
  },
  romans: {
    // 1-4
    1: "https://www.youtube-nocookie.com/embed/ej_6dVdJSIU?si=bSti3NaNw0b-Vy-G&amp;controls=0",
    // 5-16
    5: "https://www.youtube-nocookie.com/embed/0SVTl4Xa5fY?si=yopHnGgi5n9nkhWJ&amp;controls=0",
  },
  firstcorinthians: {
    1: "https://www.youtube-nocookie.com/embed/yiHf8klCCc4?si=wIxwnZuPtbBN1WFD&amp;controls=0",
  },
  secondcorinthians: {
    1: "https://www.youtube-nocookie.com/embed/3lfPK2vfC54?si=fVoq1dMoGwoGJkRZ&amp;controls=0",
  },
  galatians: {
    1: "https://www.youtube-nocookie.com/embed/vmx4UjRFp0M?si=9pbXeZ0YU8NVDllK&amp;controls=0",
  },
  ephesians: {
    // I love you Grandma & Grandpa
    1: "https://www.youtube-nocookie.com/embed/Y71r-T98E2Q?si=DiwKCIilFNj2oU3V&amp;controls=0",
  },
  philippians: {
    1: "https://www.youtube-nocookie.com/embed/oE9qqW1-BkU?si=cPK02ePZ7vekehaM&amp;controls=0",
  },
  colossians: {
    1: "https://www.youtube-nocookie.com/embed/pXTXlDxQsvc?si=syh0Lh8OPfS9yNIp&amp;controls=0",
  },
  firstthessalonians: {
    1: "https://www.youtube-nocookie.com/embed/No7Nq6IX23c?si=EEO4yvlSc5siGGcg&amp;controls=0",
  },
  secondthessalonians: {
    1: "https://www.youtube-nocookie.com/embed/kbPBDKOn1cc?si=uNvhxXY0SlVfLR-9&amp;controls=0",
  },
  firsttimothy: {
    1: "https://www.youtube-nocookie.com/embed/7RoqnGcEjcs?si=Lxrag8khmr4epxKc&amp;controls=0",
  },
  secondtimothy: {
    1: "https://www.youtube-nocookie.com/embed/urlvnxCaL00?si=AV6_rP2lqBbEKGPM&amp;controls=0",
  },
  titus: {
    1: "https://www.youtube-nocookie.com/embed/PUEYCVXJM3k?si=jnwLLl9cqOjQaOt4&amp;controls=0",
  },
  philemon: {
    1: "https://www.youtube-nocookie.com/embed/aW9Q3Jt6Yvk?si=e3QaG6AeaIROXzx6&amp;controls=0",
  },
  hebrews: {
    1: "https://www.youtube-nocookie.com/embed/1fNWTZZwgbs?si=NTwekx951yY1bgnx&amp;controls=0",
  },
  james: {
    1: "https://www.youtube-nocookie.com/embed/qn-hLHWwRYY?si=l296wcunVAMQdWM3&amp;controls=0",
  },
  firstpeter: {
    1: "https://www.youtube-nocookie.com/embed/WhP7AZQlzCg?si=-h0FW-ZDwoSgSM_Z&amp;controls=0",
  },
  secondpeter: {
    1: "https://www.youtube-nocookie.com/embed/wWLv_ITyKYc?si=-C2a6B9Uv1nhI_21&amp;controls=0",
  },
  firstjohn: {
    1: "https://www.youtube-nocookie.com/embed/l3QkE6nKylM?si=xEbwBdjl-Zl4Bn-t&amp;controls=0",
  },
  secondjohn: {
    1: "https://www.youtube-nocookie.com/embed/l3QkE6nKylM?si=xEbwBdjl-Zl4Bn-t&amp;controls=0",
  },
  thirdjohn: {
    1: "https://www.youtube-nocookie.com/embed/l3QkE6nKylM?si=xEbwBdjl-Zl4Bn-t&amp;controls=0",
  },
  jude: {
    1: "https://www.youtube-nocookie.com/embed/6UoCmakZmys?si=xagDT-EpLAJEHquE&amp;controls=0",
  },
  revelation: {
    // 1 - 11
    // 12 - 22
    1: "https://www.youtube-nocookie.com/embed/5nvVVcYD-0w?si=_7VhSzUUchPfgL7K&amp;controls=0",
    12: "https://www.youtube-nocookie.com/embed/QpnIrbq2bKo?si=8ernx63Zyu5JdTMO&amp;controls=0",
  },
};

// Define the props expected for the VideoModal component
interface VideoModalProps {
  currentBook?: string;
  currentChapter?: number;
}

// eslint-ignore-next-line
const VideoModal = ({
  currentBook = "",
  currentChapter = 1,
}: VideoModalProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const generateVideoUrl = (book: string, chapter: number) => {
    if (!book || !chapter) {
      return "";
    }

    // Trim spaces and make sure the format is correct
    const cleanBook = book.trim().replace(/\s+/g, "-").toLowerCase();

    if (videoSources[cleanBook]) {
      const chapterRanges = Object.keys(videoSources[cleanBook]).map(Number);

      // Iterate over each chapter range
      for (let i = 0; i < chapterRanges.length; i++) {
        const startChapter = chapterRanges[i];
        const nextStartChapter = chapterRanges[i + 1]; // Next range's start chapter
        const endChapter = nextStartChapter ? nextStartChapter - 1 : Infinity; // If there's no next range, the end is infinite

        // Check if the current chapter falls within the range (startChapter to endChapter)
        if (chapter >= startChapter && chapter <= endChapter) {
          return videoSources[cleanBook][startChapter];
        }
      }
    }

    // Return a default or fallback video URL if not found
    return "";
  };

  const videoUrl = generateVideoUrl(currentBook, currentChapter);

  return (
    <div>
      <Tooltip
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              paddingRight: "10px",
            }}
          >
            <img
              src={TBPLogoSQ}
              style={{ width: "75px", height: "75px" }}
              alt="The Bible Project Logo"
            />
            <span>Watch Video Summary</span>
          </div>
        }
      >
        <IconButton
          onClick={handleOpen}
          sx={{
            mt: "-5px",
            width: "50px",
            height: "50px",
            ml: 3,
            borderRadius: "50%",
          }}
        >
          <VideoCall />
        </IconButton>
      </Tooltip>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "transparent",
            boxShadow: "0px 10px 0px 0px rgba(0, 0, 0, 0.5)",
            outline: "none",
            width: {
              xs: "90%",
              sm: "80%",
              md: "60%",
            },
            maxWidth: {
              xs: "100vw",
              sm: "100vw",
              md: "1000px",
            },
            maxHeight: {
              xs: "80vh",
              sm: "80vh",
              md: "50vh",
            },
            "& iframe": {
              width: "100%",
              height: "100%",
              maxWidth: "100%",
              maxHeight: "100%",
              aspectRatio: "16/9",
            },
          }}
        >
          <a href="https://www.bibleproject.com/" target="_blank" rel="noopener noreferrer">
          <img src={TBPLogo} height="36" style={{ marginLeft: 3, backgroundColor: "#212121", boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)" }} alt="The Bible Project Logo" />
          </a>
          <Box>
            {videoUrl ? (
              <iframe
                src={videoUrl}
                title="The Bible Project Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{
                  filter: "grayscale(1) contrast(2.5)",
                  opacity: 0.8,
                }}
              ></iframe>
            ) : (
              <p>No video available for this chapter.</p>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default VideoModal;
