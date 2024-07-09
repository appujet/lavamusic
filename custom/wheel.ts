import { Command, type Context, type Lavamusic } from "../../structures/index.js";
import { createCanvas } from "canvas";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import { AttachmentBuilder } from 'discord.js';
import fs from 'fs';
import { fileURLToPath } from 'url';


export default class Wheel extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "wheel",
            description: {
                content: "Generates a spinning wheel with the provided arguments and sends a video.",
                usage: "wheel arg1, arg2, arg3 ... argN",
                examples: ["wheel apple, banana, cherry"],
            },
            category: "fun",
            aliases: ["spin"],
            cooldown: 10,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "AttachFiles"],
                user: [],
            },
            slashCommand: false,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        // Join args into a single string and split by commas, then trim any whitespace
        let options = args.join(" ").split(",").map(arg => arg.trim()).filter(arg => arg.length > 0);

        // Resolve mentions to nicknames
        options = options.map(option => {
            const mention = ctx.message.mentions.members.get(option.replace(/[<@!>]/g, ''));
            return mention ? mention.displayName : option;
        });

        if (options.length < 2) {
            return ctx.sendMessage("Please provide at least two options to spin the wheel, separated by commas.");
        }

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const outputDir = path.join(__dirname, '../../../videos');
        const outputFilePath = path.join(outputDir, 'wheel.mp4');

        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const numOptions = options.length;
        const canvas = createCanvas(1000, 1000); // Increased resolution
        const ctxCanvas = canvas.getContext("2d");
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        const angleStep = (2 * Math.PI) / numOptions;

        // Shuffle the options
        const shuffledOptions = this.shuffleArray(options);

        // Generate colors once and reuse them
        const colors = Array.from({ length: numOptions }, () => this.getRandomColor());

        const fps = 60;
        const duration = 1; // Duration in seconds
        const totalFrames = fps * duration;
        const avgFrameTime = 0.05; // average time to generate one frame in seconds
        const avgVideoTime = 2; // average time to create the video in seconds
        const optionFactor = 0.05; // small factor per option to account for processing
        const estimatedTime = Math.ceil(totalFrames * avgFrameTime + avgVideoTime + numOptions * optionFactor);

        // Determine the final angle for the wheel to stop at a random position
        const randomIndex = Math.floor(Math.random() * numOptions);
        const finalAngle = (2 * Math.PI * randomIndex) + (Math.random() * angleStep);
        await ctx.sendMessage(`Generating wheel... This may take approximately ${estimatedTime} seconds.`);

        const drawWheel = (rotationAngle: number) => {
            ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the wheel
            for (let i = 0; i < numOptions; i++) {
                const startAngle = i * angleStep + rotationAngle;
                const endAngle = startAngle + angleStep;
                ctxCanvas.beginPath();
                ctxCanvas.moveTo(centerX, centerY);
                ctxCanvas.arc(centerX, centerY, radius, startAngle, endAngle);
                ctxCanvas.fillStyle = colors[i];
                ctxCanvas.fill();
                ctxCanvas.stroke();

                // Draw text
                ctxCanvas.save();
                ctxCanvas.translate(centerX, centerY);
                ctxCanvas.rotate((startAngle + endAngle) / 2);
                ctxCanvas.textAlign = "right";
                ctxCanvas.fillStyle = "#000";

                // Adjust font size based on the length of the option and number of options
                const fontSize = Math.min(60, 1000 / numOptions, 600 / shuffledOptions[i].length);
                ctxCanvas.font = `${fontSize}px Arial`;

                ctxCanvas.fillText(shuffledOptions[i], radius - 20, 10);
                ctxCanvas.restore();
            }

            // Draw the pointer
            ctxCanvas.beginPath();
            ctxCanvas.moveTo(centerX, centerY - radius);
            ctxCanvas.lineTo(centerX - 20, centerY - radius - 20);
            ctxCanvas.lineTo(centerX + 20, centerY - radius - 20);
            ctxCanvas.fillStyle = "#ff0000";
            ctxCanvas.fill();
        };

        const saveFrame = (frameNum: number, callback: () => void) => {
            const progress = frameNum / totalFrames;
            const easeOutCubic = (t: number) => (--t) * t * t + 1; // Easing function for smooth stop
            const rotationAngle = easeOutCubic(progress) * finalAngle + 2 * Math.PI * progress * duration;
            drawWheel(rotationAngle);
            const buffer = canvas.toBuffer('image/png');
            const filePath = path.join(outputDir, `frame-${frameNum.toString().padStart(4, '0')}.png`);
            fs.writeFile(filePath, buffer, callback);
        };

        const createVideo = () => {
            return new Promise<void>((resolve, reject) => {
                const ffmpegCommand = ffmpeg()
                    .setFfmpegPath(ffmpegPath)
                    .input(path.join(outputDir, 'frame-%04d.png'))
                    .inputOptions('-framerate', fps.toString())
                    .outputOptions('-pix_fmt', 'yuv420p')
                    .videoCodec('libx264')
                    .on('end', () => resolve())
                    .on('error', (err) => reject(err))
                    .save(outputFilePath);
            });
        };

        const cleanUp = () => {
            fs.readdir(outputDir, (err, files) => {
                if (err) throw err;
                for (const file of files) {
                    if (file.startsWith('frame-')) {
                        fs.unlink(path.join(outputDir, file), err => {
                            if (err) throw err;
                        });
                    }
                }
            });
        };

        try {
            for (let i = 0; i < totalFrames; i++) {
                await new Promise<void>((resolve) => saveFrame(i, resolve));
            }
            await createVideo();
            const attachment = new AttachmentBuilder(outputFilePath, { name: 'wheel.mp4' });
            await ctx.sendMessage({ files: [attachment] });
        } catch (error) {
            console.error("Error generating video:", error);
            await ctx.sendMessage("There was an error generating the video.");
        } finally {
            cleanUp();
            if (fs.existsSync(outputFilePath)) {
                fs.unlinkSync(outputFilePath);
            }
        }
    }

    private shuffleArray(array: string[]): string[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    private getRandomColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}
