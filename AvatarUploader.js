import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import getCroppedImg from "./cropImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const AvatarUploader = () => {
  const inputRef = useRef();
  const triggerFileSelect = () => inputRef.current.click();
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const imgUrl = selectedImage && URL.createObjectURL(selectedImage);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imgUrl,
        croppedAreaPixels,
        rotation
      );
      console.log("donee", { croppedImage });
      setCroppedImage(croppedImage);
      setSelectedImage(null);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);

  return (
    <>
      <input
        type="file"
        name="myImage"
        id="myImage"
        className="upload-input"
        accept="image/*"
        ref={inputRef}
        onChange={(event) => {
          console.log(event.target.files[0]);
          setSelectedImage(event.target.files[0]);
        }}
      />
      {croppedImage ? (
        <div className="centered" onClick={triggerFileSelect}>
          <img
            src={croppedImage}
            className="rounded-circle"
            width="75px"
            height="75px"
          />
        </div>
      ) : (
        <div
          className="rounded-circle bg-dark-gray p-4 centered"
          style={{ width: "75px", height: "75px" }}
          onClick={triggerFileSelect}
        >
          <FontAwesomeIcon icon={faCamera} color="#ffffff" />
        </div>
      )}
      {selectedImage && (
        <div>
          <div className="cropContainer">
            <Cropper
              image={imgUrl}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="controls centered">
            <div className="sliderContainer">
              <Typography variant="overline">Zoom</Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e, zoom) => setZoom(zoom)}
              />
            </div>
            <div className="sliderContainer">
              Rotation
              <Slider
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                onChange={(e, rotation) => setRotation(rotation)}
              />
            </div>
            <Button
              onClick={showCroppedImage}
              variant="contained"
              color="primary"
            >
              بارگذاری
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarUploader;
