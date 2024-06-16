import { GeneratePodcastProps } from '@/types';
import React, { useRef, useState } from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Loader } from 'lucide-react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import axios from 'axios';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { v4 as uuidv4 } from 'uuid';

// const useGeneratePodcast = ({ setAudio, voiceType, voicePrompt, setAudioStorageId }: GeneratePodcastProps) => {
//   const [isGenerating, setIsGenerating] = useState(false);

//   const generateUploadUrl = useMutation(api.files.generateUploadUrl);
//   const { startUpload } = useUploadFiles(generateUploadUrl);

//   const getAudioUrl = useMutation(api.podcasts.getUrl);

//   const generatePodcast = async () => {
//     setIsGenerating(true);
//     setAudio('');
//     console.log('I am in creating');

//     const apiKey = 'AIzaSyCXEMSKF5L-AhM6gMFLoR2L3RoCcIdFhgU';
//     const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
//     // const voicePrompt = 'Your text here'; // Ensure voicePrompt is defined or passed as a parameter

//     try {
//       const response = await axios.post(
//         url,
//         {
//           input: {
//             text: voicePrompt,
//           },
//           voice: {
//             languageCode: 'en-US',
//             ssmlGender: 'NEUTRAL',
//           },
//           audioConfig: {
//             audioEncoding: 'MP3',
//           },
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           responseType: 'blob', // Ensure the response is in binary format
//         },
//       );

//       console.log(response);
//       const fileName = `podcast-${uuidv4()}.mp3`;
//       const file = new File([response.data], fileName, { type: 'audio/mpeg' });

//       const uploaded = await startUpload([file]);
//       const storageId = (uploaded[0].response as any).storageId;

//       const imageUrl = await getAudioUrl({ storageId });
//       setAudio(imageUrl!);
//       setIsGenerating(false);
//     } catch (error) {
//       console.error('Error converting text to speech:', error);
//       setIsGenerating(false);
//     }
//   };

//   return { isGenerating, generatePodcast };
// };

// const GeneratePodcast = (props: GeneratePodcastProps) => {
//   const { isGenerating, generatePodcast } = useGeneratePodcast(props);
//   const [isAiAudio, setIsAiAudio] = useState(true);
//   const [isAudioLoading, setIsAudioLoading] = useState(false);
//   const audioRef = useRef<HTMLInputElement>(null);

//   const generateUploadUrl = useMutation(api.files.generateUploadUrl);
//   const { startUpload } = useUploadFiles(generateUploadUrl);

//   const getAudioUrl = useMutation(api.podcasts.getUrl);

//   const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();

//     try {
//       const files = e.target.files;
//       if (!files) return;
//       const file = files[0];
//       const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

//       handleAudio(blob, file.name);
//     } catch (error) {
//       console.log(error);
//       // toast({ title: 'Error uploading image', variant: 'destructive' });
//     }
//   };

//   const handleAudio = async (blob: Blob, fileName: string) => {
//     setIsAudioLoading(true);
//     props.setAudio('');

//     try {
//       const file = new File([blob], fileName, { type: 'audio/mpeg' });

//       const uploaded = await startUpload([file]);
//       const storageId = (uploaded[0].response as any).storageId;

//       // getAudioUrl(storageId);

//       const imageUrl = await getAudioUrl({ storageId });
//       props.setAudio(imageUrl!);
//       setIsAudioLoading(false);
//       // toast({
//       //   title: 'Thumbnail generated successfully',
//       // });
//     } catch (error) {
//       console.log(error);
//       // toast({ title: 'Error generating thumbnail', variant: 'destructive' });
//     }
//   };

//   return (
//     // <div>
//     //   <div className="flex flex-col gap-2.5">
//     //     <Label className="text-16 font-bold text-white-1">AI Prompt to generate Podcast</Label>
//     //     <Textarea
//     //       className="input-class font-light focus-visible:ring-offset-orange-1"
//     //       placeholder="Provide text to generate audio"
//     //       rows={5}
//     //       value={props.voicePrompt}
//     //       onChange={(e) => props.setVoicePrompt(e.target.value)}
//     //     />
//     //   </div>
//     //   <div className="mt-5 w-full max-w-[200px]">
//     //     <Button className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodcast}>
//     //       {isGenerating ? (
//     //         <>
//     //           Generating
//     //           <Loader size={20} className="animate-spin ml-2" />
//     //         </>
//     //       ) : (
//     //         'Generate'
//     //       )}
//     //     </Button>
//     //   </div>

//     //   {props.audio && <audio controls src={props.audio} autoPlay className="mt-5" />}
//     // </div>

//     <>
//       <div className="generate_thumbnail">
//         <Button
//           type="button"
//           variant="plain"
//           onClick={() => setIsAiAudio(true)}
//           className={cn('', {
//             'bg-black-6': isAiAudio,
//           })}
//         >
//           Use AI to generate Podcast
//         </Button>
//         <Button
//           type="button"
//           variant="plain"
//           onClick={() => setIsAiAudio(false)}
//           className={cn('', {
//             'bg-black-6': !isAiAudio,
//           })}
//         >
//           Upload Exist Audio
//         </Button>
//       </div>
//       {isAiAudio ? (
//         <>
//           <div>
//             <div className="flex flex-col gap-2.5">
//               <Label className="text-16 font-bold text-white-1">AI Prompt to generate Podcast</Label>
//               <Textarea
//                 className="input-class font-light focus-visible:ring-offset-orange-1"
//                 placeholder="Provide text to generate audio"
//                 rows={5}
//                 value={props.voicePrompt}
//                 onChange={(e) => props.setVoicePrompt(e.target.value)}
//               />
//             </div>
//             <div className="mt-5 w-full max-w-[200px]">
//               <Button className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodcast}>
//                 {isGenerating ? (
//                   <>
//                     Generating
//                     <Loader size={20} className="animate-spin ml-2" />
//                   </>
//                 ) : (
//                   'Generate'
//                 )}
//               </Button>
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="image_div" onClick={() => audioRef?.current?.click()}>
//           <Input type="file" className="hidden" ref={audioRef} onChange={(e) => uploadAudio(e)} />
//           {!isAudioLoading ? (
//             <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
//           ) : (
//             <div className="text-16 flex-center font-medium text-white-1">
//               Uploading
//               <Loader size={20} className="animate-spin ml-2" />
//             </div>
//           )}
//           <div className="flex flex-col items-center gap-1">
//             <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
//             {/* <p className="text-12 font-normal text-gray-1">SVG, PNG, JPG, or GIF (max. 1080x1080px)</p> */}
//           </div>
//         </div>
//       )}
//       {props.audio && <audio controls src={props.audio} autoPlay className="mt-5" />}
//     </>
//   );
// };

// export default GeneratePodcast;

const useGeneratePodcast = ({ setAudio, voiceType, voicePrompt, setAudioStorageId }: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio('');

    const apiKey = 'AIzaSyCXEMSKF5L-AhM6gMFLoR2L3RoCcIdFhgU';
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    try {
      const response = await axios.post(
        url,
        {
          input: {
            text: voicePrompt,
          },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Wavenet-D', // Ensure a specific voice is selected
            ssmlGender: 'NEUTRAL',
          },
          audioConfig: {
            audioEncoding: 'MP3',
          },
        },
        {
          responseType: 'blob',
        },
      );

      if (response.status !== 200) {
        throw new Error('Failed to generate audio');
      }
      const jsonString = await response.data.text(); // Convert Blob to JSON string
      const responseData = JSON.parse(jsonString); // Parse JSON string to JavaScript object

      console.log('API Response:', responseData);
      console.log('API Response Data:', response.data);
      const audioData = atob(responseData.audioContent); // Decode base64 to binary
      const byteArray = new Uint8Array(audioData.length);

      for (let i = 0; i < audioData.length; i++) {
        byteArray[i] = audioData.charCodeAt(i); // Convert binary string to Uint8Array
      }

      const audioBlob = new Blob([byteArray], { type: 'audio/mpeg' }); // Create Blob with audio data
      const audioUrl = URL.createObjectURL(audioBlob); // Create URL for audio playback or further use

      // Convert arraybuffer to blob
      // const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      console.log('Audio Blob:', audioBlob.size, audioBlob.type);

      // Check the size of the blob
      if (audioBlob.size === 0) {
        throw new Error('Generated audio blob is empty');
      }

      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([audioBlob], fileName, { type: 'audio/mpeg' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      const imageUrl = await getAudioUrl({ storageId });
      console.log('Uploaded Audio URL:', imageUrl);
      // const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });

      // Create a Blob URL for playback
      // const audioUrl = URL.createObjectURL(audioBlob);

      // Set the audio URL for immediate playback
      setAudio(audioUrl);
      // setAudio(imageUrl!);
    } catch (error) {
      console.error('Error converting text to speech:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, generatePodcast };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);
  const [isAiAudio, setIsAiAudio] = useState(true);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      handleAudio(blob, file.name);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAudio = async (blob: Blob, fileName: string) => {
    setIsAudioLoading(true);
    props.setAudio('');

    try {
      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      const imageUrl = await getAudioUrl({ storageId });
      props.setAudio(imageUrl!);
      setIsAudioLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiAudio(true)}
          className={cn('', {
            'bg-black-6 w-full': isAiAudio,
          })}
        >
          Use AI to generate Podcast
        </Button>
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiAudio(false)}
          className={cn('', {
            'bg-black-6 w-full': !isAiAudio,
          })}
        >
          Upload Exist Audio
        </Button>
      </div>
      {isAiAudio ? (
        <div className="mt-4">
          <div>
            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">AI Prompt to generate Podcast</Label>
              <Textarea
                className="input-class font-light focus-visible:ring-offset-orange-1"
                placeholder="Provide text to generate audio"
                rows={5}
                value={props.voicePrompt}
                onChange={(e) => props.setVoicePrompt(e.target.value)}
              />
            </div>
            <div className="mt-5 w-full  text-center ">
              <Button className="text-16 w-full lg:max-w-[200px] bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodcast}>
                {isGenerating ? (
                  <>
                    Generating
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => audioRef?.current?.click()}>
          <Input type="file" className="hidden" ref={audioRef} onChange={(e) => uploadAudio(e)} />
          {!isAudioLoading ? (
            <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
          </div>
        </div>
      )}
      {props.audio && (
        <audio controls src={props.audio} className="mt-5">
          Your browser does not support the audio element.
        </audio>
      )}
    </>
  );
};

export default GeneratePodcast;
