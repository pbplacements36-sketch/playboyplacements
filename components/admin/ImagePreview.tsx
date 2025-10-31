const ImagePreview = ({ images }: { images: string[] }) => {
    return (
        <div className="image-preview-container">
            {images.length > 0 ? (
                images.map((src, index) => (
                    <div key={index} className="image-preview">
                        <img src={src} alt={`Uploaded Preview ${index + 1}`} />
                    </div>
                ))
            ) : (
                <p>No images uploaded yet.</p>
            )}
        </div>
    );
};

export default ImagePreview;