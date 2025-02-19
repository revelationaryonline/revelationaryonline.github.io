import React, { useState } from "react";
import { IconButton, Modal, Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { VideoCall } from "@mui/icons-material";

const videoSources = {
    genesis: {
      1: "https://www.youtube-nocookie.com/embed/GQI72THyO5I?si=zbWixZDFtB_GBJjE&controls=0",
      2: "https://www.youtube-nocookie.com/embed/F4isSyennFo?si=-gNKc8GuD-iIeb0Q&controls=0",
    },
    exodus: {
      1: "https://www.youtube-nocookie.com/embed/jH_aojNJM3E?si=r5RjNuqvfgShPK_O&amp;controls=0",
      2: "https://www.youtube-nocookie.com/embed/oNpTha80yyE?si=fWjF7HjkM4BadpWP&amp;controls=0",
    },
    leviticus: {
      1: "https://www.youtube-nocookie.com/embed/IJ-FekWUZzE?si=qV0cHZ6DXlEm1caM&amp;controls=0"
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
    firstSamuel: {
        1: "https://www.youtube-nocookie.com/embed/QJOju5Dw0V0?si=vtE-hkKFJbkujicT&amp;controls=0",
    },
    secondSamuel: {
        1: "https://www.youtube-nocookie.com/embed/YvoWDXNDJgs?si=gcrggc8IfyHc2RJO&amp;controls=0",
    },
    firstKings: {
        1: "https://www.youtube-nocookie.com/embed/bVFW3wbi9pk?si=HOUqzcMAlsJnEEI2&amp;controls=0",
    },
    secondKings: {
        1: "https://www.youtube-nocookie.com/embed/bVFW3wbi9pk?si=HOUqzcMAlsJnEEI2&amp;controls=0",
    },
    firstChronicles: {
        1: "https://www.youtube-nocookie.com/embed/HR7xaHv3Ias?si=EydK9ckzc1K8G8pB&amp;controls=0",
    },
    secondChronicles: {
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
    songOfSolomon: {
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
        2: "https://www.youtube-nocookie.com/embed/GGCF3OPWN14?si=igFEAqHD5omEec-7&amp;controls=0",
    },
    mark: {
        1: "https://www.youtube-nocookie.com/embed/HGHqu9-DtXk?si=n6MyF2k2DeAgdOTt&amp;controls=0",
    },
    luke: {
        // 1-9
        1: "https://www.youtube-nocookie.com/embed/XIb_dCIxzr0?si=Ue4jNUytjiT_fNcl&amp;controls=0",
        // 10-24
        2: "https://www.youtube-nocookie.com/embed/26z_KhwNdD8?si=_7yY524NF0SbtjdI&amp;controls=0",
    },
    john: {
        // 1-12
        1: "https://www.youtube-nocookie.com/embed/G-2e9mMf7E8?si=HO5oDp72Uv472svr&amp;controls=0",
        // 13-21
        2: "https://www.youtube-nocookie.com/embed/RUfh_wOsauk?si=aLj4H-MS1XCj5Mjw&amp;controls=0",
    },
    acts: {
        // 1-12
        1: "https://www.youtube-nocookie.com/embed/CGbNw855ksw?si=2MBuzo0UbkcucUQe&amp;controls=0",
        // 13-28
        2: "https://www.youtube-nocookie.com/embed/Z-17KxpjL0Q?si=b6TFKtPQ8aCa8zde&amp;controls=0",
    },
    romans: {
        // 1-4
        1: "https://www.youtube-nocookie.com/embed/ej_6dVdJSIU?si=bSti3NaNw0b-Vy-G&amp;controls=0",
        // 5-16
        2: "https://www.youtube-nocookie.com/embed/0SVTl4Xa5fY?si=yopHnGgi5n9nkhWJ&amp;controls=0",
    },
    firstCorinthians: {
        1: "https://www.youtube-nocookie.com/embed/yiHf8klCCc4?si=wIxwnZuPtbBN1WFD&amp;controls=0",
    },
    secondCorinthians: {
        1: "https://www.youtube-nocookie.com/embed/3lfPK2vfC54?si=fVoq1dMoGwoGJkRZ&amp;controls=0",
    },
    galatians: {
        1: "https://www.youtube-nocookie.com/embed/vmx4UjRFp0M?si=9pbXeZ0YU8NVDllK&amp;controls=0",
    },
    ephesians: {
        // I love you Grandma 
        1: "https://www.youtube-nocookie.com/embed/Y71r-T98E2Q?si=DiwKCIilFNj2oU3V&amp;controls=0",
    },
    philippians: {
        1: "https://www.youtube-nocookie.com/embed/oE9qqW1-BkU?si=cPK02ePZ7vekehaM&amp;controls=0",
    },
    colossians: {
        1: "https://www.youtube-nocookie.com/embed/pXTXlDxQsvc?si=syh0Lh8OPfS9yNIp&amp;controls=0",
    },
    firstThessalonians: {
        1: "https://www.youtube-nocookie.com/embed/No7Nq6IX23c?si=EEO4yvlSc5siGGcg&amp;controls=0",
    },
    secondThessalonians: {
        1: "https://www.youtube-nocookie.com/embed/kbPBDKOn1cc?si=uNvhxXY0SlVfLR-9&amp;controls=0",
    },
    firstTimothy: {
        1: "https://www.youtube-nocookie.com/embed/7RoqnGcEjcs?si=Lxrag8khmr4epxKc&amp;controls=0",
    },
    secondTimothy: {
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
    firstPeter: {
        1: "https://www.youtube-nocookie.com/embed/WhP7AZQlzCg?si=-h0FW-ZDwoSgSM_Z&amp;controls=0",
    },
    secondPeter: {
        1: "https://www.youtube-nocookie.com/embed/wWLv_ITyKYc?si=-C2a6B9Uv1nhI_21&amp;controls=0",
    },
    firstJohn: {
        1: "https://www.youtube-nocookie.com/embed/l3QkE6nKylM?si=xEbwBdjl-Zl4Bn-t&amp;controls=0",
    },
    secondJohn: {
        1: "https://www.youtube-nocookie.com/embed/l3QkE6nKylM?si=xEbwBdjl-Zl4Bn-t&amp;controls=0",
    },
    thirdJohn: {
        1: "https://www.youtube-nocookie.com/embed/l3QkE6nKylM?si=xEbwBdjl-Zl4Bn-t&amp;controls=0",
    },
    jude: {
        1: "https://www.youtube-nocookie.com/embed/6UoCmakZmys?si=xagDT-EpLAJEHquE&amp;controls=0",
    },
    revelation: {
        1: "https://www.youtube-nocookie.com/embed/5nvVVcYD-0w?si=_7VhSzUUchPfgL7K&amp;controls=0",
        2: "https://www.youtube-nocookie.com/embed/QpnIrbq2bKo?si=8ernx63Zyu5JdTMO&amp;controls=0",
    }
  };

const VideoModal = ({ currentBook, currentChapter }) => {
  const [open, setOpen] = useState(false);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const generateVideoUrl = (book, chapter) => {
    if (!book || !chapter) {
      console.log("Missing book or chapter:", book, chapter);
      return "";
    }
  
    // Trim spaces and make sure the format is correct
    const cleanBook = book.trim().replace(/\s+/g, "-").toLowerCase();
    // const cleanChapter = chapter.toString().trim();

    if (videoSources[cleanBook]) {
        return chapter <= 11 ? videoSources[cleanBook][1] : videoSources[cleanBook][2] || "";
      }

    return "";
  };
  
  const videoSrc = generateVideoUrl(currentBook, currentChapter);

  return (
    <>
      <Tooltip title="Video">
        <IconButton
          onClick={handleOpen}
          sx={{
            opacity: 0.75,
            marginLeft: "1rem",
            "&.MuiIconButton-root:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.00)",
              opacity: 1,
            },
          }}
        >
          <VideoCall fontSize="medium" />
        </IconButton>
      </Tooltip>
      <Modal open={open} onClose={handleClose} closeAfterTransition >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 0,
            outline: "none",
          }}
        >
            <iframe
              width="560"
              height="315"
              src={videoSrc ? videoSrc : ""}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{
                filter: 'grayscale(1) contrast(2.5)',
                opacity: 0.8,
              }}
            ></iframe>
        </Box>
      </Modal>
    </>
  );
};

export default VideoModal;