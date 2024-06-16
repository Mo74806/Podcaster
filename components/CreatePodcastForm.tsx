'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';
import GeneratePodcast from './GeneratePodcast';
import GenerateThumbnail from './GenerateThumbnail';
import { Button } from './ui/button';
import { Loader } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';
import type { VoiceType } from '@/types';

const CreatePodcastForm = () => {
  const router = useRouter();
  const [voiceType, setVoiceType] = useState<string | null>(null);
  // const voiceCategories = ['alloy', 'shimmer', 'nova', 'echo', 'fable', 'onyx'];
  const voiceCategories = ['Male', 'Female'];
  const [voicePrompt, setVoicePrompt] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStorageId, setImageStorageId] = useState<Id<'_storage'> | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const [audioUrl, setAudioUrl] = useState('');
  const [audioStorageId, setAudioStorageId] = useState<Id<'_storage'> | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formSchema = z.object({
    podcastTitle: z.string().min(2),
    podcastDescription: z.string().min(2),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: '',
      podcastDescription: '',
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    //console.log(data)
    try {
    } catch (error) {
      //console.log(error);
    } finally {
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">
        <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
          <FormField
            control={form.control}
            name="podcastTitle"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">Title</FormLabel>
                <FormControl>
                  <Input className="input-class focus-visible:ring-offset-orange-1" placeholder="Podcast Title Here" {...field} />
                </FormControl>
                <FormMessage className="text-error" />
              </FormItem>
            )}
          />
          {/* //ai voice */}
          <div className="flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1 mb-2">Select AI Voice</Label>

            <Select onValueChange={(value) => setVoiceType(value)}>
              <SelectTrigger className={cn('text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1')}>
                <SelectValue placeholder="Select AI Voice" className="placeholder:text-gray-1 " />
              </SelectTrigger>
              <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                {voiceCategories.map((category) => (
                  <SelectItem key={category} value={category} className="capitalize focus:bg-orange-1">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
              {!voiceType && <p className="text-error">Please Select Voice Type</p>}
             </Select>
          </div>

          <FormField
            control={form.control}
            name="podcastDescription"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5">
                <FormLabel className="text-16 font-bold text-white-1">Description</FormLabel>
                <FormControl>
                  <Textarea className="input-class focus-visible:ring-offset-orange-1" placeholder="Write a short podcast description" {...field} />
                </FormControl>
                <FormMessage className="text-error" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col pt-10">
          {/* //genereate Podcast */}
          <GeneratePodcast
            setAudioStorageId={setAudioStorageId}
            setAudio={setAudioUrl}
            voiceType={voiceType!}
            audio={audioUrl}
            voicePrompt={voicePrompt}
            setVoicePrompt={setVoicePrompt}
            setAudioDuration={setAudioDuration}
          />
          {/* //genereate Thumbnail */}
          <GenerateThumbnail
            setImage={setImageUrl}
            setImageStorageId={setImageStorageId}
            image={imageUrl}
            imagePrompt={imagePrompt}
            setImagePrompt={setImagePrompt}
          />
          <div className="mt-10 w-full">
            <Button
              type="submit"
              className="text-16 w-full bg bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
            >
              {isSubmitting ? (
                <>
                  Submitting
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                'Submit & Publish Podcast'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreatePodcastForm;
