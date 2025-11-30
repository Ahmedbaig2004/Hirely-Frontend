import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion"; // Make sure you import from 'framer-motion'
import { IconUpload, IconX } from "@tabler/icons-react"; // Added IconX
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    // We only want ONE file for this app, so we replace the array
    const fileList = [...newFiles];
    setFiles(fileList);
    onChange && onChange(fileList);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // ✅ NEW: Remove File Logic
  const handleRemove = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation(); // Stop opening the file dialog
    const updatedFiles = files.filter((_, idx) => idx !== indexToRemove);
    setFiles(updatedFiles);
    onChange && onChange(updatedFiles);
    
    // Clear input value so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        // ✅ CHANGED: p-10 -> p-4 to make it compact
        className="p-4 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-neutral-900"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center">
          {/* ✅ LOGIC: If file exists, hide the 'Drag & Drop' text to save space */}
          {files.length === 0 && (
             <>
                <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-sm">
                    Upload Resume
                </p>
                <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-xs mt-1">
                    Drag or click to browse (PDF)
                </p>
             </>
          )}

          <div className="relative w-full mt-2 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-800 flex flex-col items-start justify-start p-3 w-full mx-auto rounded-md",
                    "shadow-sm border border-slate-200 dark:border-slate-700"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-xs font-medium"
                    >
                      {file.name}
                    </motion.p>
                    
                    {/* ✅ NEW: Delete Button */}
                    <button
                        onClick={(e) => handleRemove(e, idx)}
                        className="p-1 rounded-full hover:bg-red-100 text-red-500 transition"
                    >
                        <IconX size={16} />
                    </button>
                  </div>

                  <div className="flex text-xs md:flex-row flex-col items-start md:items-center w-full mt-1 justify-between text-neutral-500 dark:text-neutral-400">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>
                </motion.div>
              ))}
              
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                // ✅ CHANGED: Height h-32 -> h-20 to make it shorter
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-20 mt-2 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};