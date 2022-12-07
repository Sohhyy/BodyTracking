import { PoseEngine } from "@geenee/bodyprocessors";
import { Recorder } from "@geenee/armature";
import { OutfitParams } from "@geenee/bodyrenderers-three";
import { AvatarRenderer } from "./avatarrenderer";
import "./index.css";

// Engine
const engine = new PoseEngine();
const token = location.hostname === "localhost" ?
    "rOlje0dxIVTYk6ZtyuJFOKQG1gM4p2EA" : "tuyAH4zfWBjaHeEeCy1dITzYZtXFENNB";

// Parameters
const urlParams = new URLSearchParams(window.location.search);
let rear = urlParams.has("rear");
// Model map
const modelMap: {
    [key: string]: {
        file: string, avatar: boolean,
        outfit?: OutfitParams
    }
} = {
    onesie: {
        file: "PinkyNewTexture.glb", avatar: false,
        outfit: {
            occluders: [/Head$/, /Body/],
            hidden: [/Eye/, /Teeth/, /Footwear/]
        }
    },
}
let model = "onesie";
let avatar = modelMap["onesie"].avatar;

// Create spinner element


async function main() {
    // Renderer
    const container = document.getElementById("root");
    let front = true;
    if (!container)
        return;
    const renderer = new AvatarRenderer(
        container, "crop", !rear, modelMap[model].file,
        avatar ? undefined : modelMap[model].outfit);
    // Camera switch
    const cameraSwitch = document.getElementById(
        "camera-switch") as HTMLButtonElement | null;
    if (cameraSwitch) {
        cameraSwitch.onclick = async () => {
            if(front){
                cameraSwitch.style.backgroundImage = "url('BackCam.png')";
                front = false;
            }
            else{
                front = true;
                cameraSwitch.style.backgroundImage = "url('FrontCam.png')";
            }
            cameraSwitch.disabled = true;
            rear = !rear;
            await engine.setup({ size: { width: 1920, height: 1080 }, rear });
            await engine.start();
            renderer.setMirror(!rear);
            cameraSwitch.disabled = false;
        }
    }

    // Recorder


    // Music
    const recordButton = document.getElementById(
        "record") as HTMLButtonElement | null;
    const audio = document.getElementById(
        "audioplayer") as HTMLAudioElement | null;


    if (recordButton && audio) {
        recordButton.onclick = () => {
            if (audio.paused) {
                audio.play();
                recordButton.style.backgroundImage = "url('MusicOn.png')";
            } else {
                audio.pause();
                recordButton.style.backgroundImage = "url('MusicOff.png')";
            }
            ;
        };
    }

    //Info

    const  infoButton = document.getElementById(
        "info") as HTMLButtonElement | null;
    if(infoButton){
        infoButton.onclick = () =>{
            window.open('#openModal', '_self')
        }
    }
    //got button

    const  gotButton = document.getElementById(
        "got") as HTMLButtonElement | null;
    const  tip1 = document.getElementById(
        "cameraTip") as HTMLDivElement | null;
    const  tip2 = document.getElementById(
        "musicTip") as HTMLDivElement | null;
    const  tip3 = document.getElementById(
        "infoTip") as HTMLDivElement | null;
    if(gotButton && tip1&&tip2&&tip3){
        gotButton.onclick = () =>{
            gotButton.style.display = 'none';
            tip1.style.display = 'none';
            tip2.style.display = 'none';
            tip3.style.display = 'none';
            if(recordButton&&audio){
                if (audio.paused) {
                    audio.play();
                    recordButton.style.backgroundImage = "url('MusicOn.png')";
                }
            }

        }
    }


    // Initialization
    await Promise.all([
        engine.addRenderer(renderer),
        engine.init({ token: token })
    ]);
    await engine.setup({ size: { width: 1920, height: 1080 }, rear });
    await engine.start();
    document.getElementById("dots")?.remove();
}
main();
