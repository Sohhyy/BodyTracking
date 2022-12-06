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
        file: "PinkyFinal4.glb", avatar: false,
        outfit: {
            occluders: [/Head$/, /Body/],
            hidden: [/Eye/, /Teeth/, /Footwear/]
        }
    },
}
let model = "onesie";
let avatar = modelMap["onesie"].avatar;

// Create spinner element
function createSpinner() {
    const container = document.createElement("div");
    container.className = "spinner-container";
    container.id = "spinner";
    const spinner = document.createElement("div");
    spinner.className = "spinner";
    for (let i = 0; i < 6; i++) {
        const dot = document.createElement("div");
        dot.className = "spinner-dot";
        spinner.appendChild(dot);
    }
    container.appendChild(spinner);
    return container;
}

async function main() {
    // Renderer
    const container = document.getElementById("root");
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
                recordButton.style.backgroundImage = "url('VolumeGIF.gif')";
            } else {
                audio.pause();
                recordButton.style.backgroundImage = "url('snapshot.png')";
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
