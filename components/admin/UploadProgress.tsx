const UploadProgress = ({ progress }: { progress: number }) => {
    return (
        <div className="upload-progress">
            <div className="progress-bar" style={{ width: `${progress}%` }}>
                {progress}%
            </div>
        </div>
    );
};

export default UploadProgress;