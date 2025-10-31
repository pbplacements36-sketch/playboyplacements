"use client";
import ImagePreview from "@/components/admin/ImagePreview";
import UploadProgress from "@/components/admin/UploadProgress";
import { useState } from "react";

const ImageUploadForm = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedFiles.length === 0) return;

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await fetch('/api/client', {
                method: 'POST',
                body: formData,
                headers: {
                    // Add any necessary headers here
                },
                onUploadProgress: (progressEvent: ProgressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    setUploadProgress(percent);
                }
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            setSuccess(true);
            setSelectedFiles([]);
            setUploadProgress(0);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" multiple onChange={handleFileChange} />
            <button type="submit">Upload</button>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">Upload successful!</div>}
            <UploadProgress progress={uploadProgress} />
            <ImagePreview images={selectedFiles} />
        </form>
    );
};

export default ImageUploadForm;