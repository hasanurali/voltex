import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Smile } from "lucide-react";
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import { Button } from "@/components";
import { ImageWithSkeleton } from "@/components/media";
import { useAuthStore } from "@/store";
import { createCommentSchema, type CreateCommentFormValues } from "../schema/commentSchema";
import { useCreateComment } from "../hooks/useCreateComment";
import { fieldApiError } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";


interface CreateCommentSectionProps {
  postId: string;
  parentComment?: string;
  onClose?: () => void;
};


const CreateCommentSection = ({ postId, parentComment, onClose }: CreateCommentSectionProps) => {

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  const auth = useAuthStore((state) => state.auth);

  const navigate = useNavigate();

  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const { register, handleSubmit, setError, reset, getValues, setValue, formState: { errors, isDirty } } = useForm<CreateCommentFormValues>({
    resolver: zodResolver(createCommentSchema)
  });

  useEffect(() => {

    const removeEmojiPicker = () => {
      if (isEmojiPickerOpen) {
        setIsEmojiPickerOpen(false);
      };
    };

    window.addEventListener('click', removeEmojiPicker);

    return () => {
      window.removeEventListener('click', removeEmojiPicker);
    };
  }, [isEmojiPickerOpen]);

  useEffect(() => {

    if (!isEmojiPickerOpen) {
      setEmojiPickerPosition(null);
      return;
    };

    const updateEmojiPickerPosition = () => {

      const button = emojiButtonRef.current;
      if (!button) {
        return;
      };

      const rect = button.getBoundingClientRect();
      const width = Math.min(350, Math.max(0, window.innerWidth - 24));
      const height = 340;
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
      const belowTop = rect.bottom + 8;
      const top = belowTop + height <= window.innerHeight - 12 ?
        belowTop
        :
        Math.max(12, rect.top - height - 8);

      setEmojiPickerPosition({ top, left, width });
    };

    updateEmojiPickerPosition();
    window.addEventListener('resize', updateEmojiPickerPosition);
    window.addEventListener('scroll', updateEmojiPickerPosition, true);

    return () => {
      window.removeEventListener('resize', updateEmojiPickerPosition);
      window.removeEventListener('scroll', updateEmojiPickerPosition, true);
    };
  }, [isEmojiPickerOpen]);

  const addEmoji = (emojiData: EmojiClickData) => {

    const currentContent = getValues('content') ?? '';
    const newContent = currentContent + emojiData.emoji;

    setValue('content', newContent, {
      shouldValidate: true,
      shouldDirty: true
    });

    setIsEmojiPickerOpen(false);
  };

  const { mutate: createCommentMutate, isPending: isCreateCommentPending } = useCreateComment();
  const onSubmit = ({ content }: CreateCommentFormValues) => {

    const createCommentpayload = {
      content,
      post: postId,
      ...(parentComment && { parentComment })
    };

    createCommentMutate(createCommentpayload, {
      onSuccess: () => {
        reset();
        if (onClose) {
          onClose();
        };
      },
      onError: (error) => {
        fieldApiError(error, setError);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${!onClose ? 'border-b border-secondary-200 pb-5' : ''}`}>
      <>
        <div className="flex items-start gap-3">

          {/* Avatar */}
          <button
            type="button"
            onClick={() => navigate(`/profile/${auth?.user.username}`)}
            className="text-start cursor-pointer"
          >
            <ImageWithSkeleton
              src={auth?.profile.avatar}
              alt={auth?.user.displayName as string}
              className="h-full w-full rounded-full object-cover"
              containerClassName={`${onClose ? 'h-8 w-8' : 'h-11 w-11'} shrink-0`}
            />
          </button>

          <textarea
            {...register('content')}
            id="comment"
            placeholder="Write a thoughtful reply..."
            className={`w-full my-auto max-h-80 resize-none field-sizing-content border-b border-secondary-200 bg-neutral-50 ${onClose ? 'p-1' : 'p-2'} text-sm leading-relaxed text-secondary-900 outline-none transition placeholder:text-neutral-400 hover:border-secondary-300 focus:border-primary-800 focus:bg-white`}
          />
        </div>

        {/* smooth animated error container */}
        {
          errors.content?.message && <div className={`grid pl-11 transition-all duration-200 ease-out ${errors ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <span className="text-[13px] text-danger block leading-tight">
                {errors.content.message}
              </span>
            </div>
          </div>
        }
      </>

      {/* Bottom action buttons */}
      <div className={`mt-2 ${onClose ? 'pl-11' : 'pl-14'} flex w-full items-center justify-between gap-2`}>
        <>
          <button
            ref={emojiButtonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsEmojiPickerOpen((isOpen) => !isOpen)
            }}
            disabled={isCreateCommentPending}
            aria-label="Add emoji"
            className="rounded-full p-2 text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <Smile aria-hidden="true" className="h-5 w-5" />
          </button>

          {
            isEmojiPickerOpen && emojiPickerPosition && createPortal(
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'fixed',
                  top: emojiPickerPosition.top,
                  left: emojiPickerPosition.left,
                  width: emojiPickerPosition.width,
                  zIndex: 1000,
                }}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] ring-1 ring-black/5"
              >
                <EmojiPicker
                  onEmojiClick={addEmoji}
                  width={emojiPickerPosition.width}
                  height={340}
                  searchPlaceHolder="Search emoji"
                  previewConfig={{ showPreview: false }}
                />
              </div>,
              document.body
            )
          }
        </>

        {/* Submit button */}
        <Button
          disabled={isCreateCommentPending || !isDirty}
          loading={isCreateCommentPending}
          type="submit"
          size="sm"
          className="shrink-0 rounded-full! px-2 sm:px-4 py-1 text-xs font-semibold cursor-pointer"
        >
          {isCreateCommentPending ? 'Replying...' : 'Reply'}
        </Button>
      </div>
    </form>
  )
};

export default CreateCommentSection;