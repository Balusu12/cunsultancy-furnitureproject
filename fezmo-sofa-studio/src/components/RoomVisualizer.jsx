
import { useEffect, useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import "./RoomVisualizer.css";

const sofaColors = [
  { name: "Sand", value: "#c6ad8c" },
  { name: "Beige", value: "#e2d4bd" },
  { name: "Cream", value: "#f3e8d5" },
  { name: "Grey", value: "#858585" },
  { name: "Charcoal", value: "#414141" },
  { name: "Sage Green", value: "#687b59" },
  { name: "Olive", value: "#88845a" },
  { name: "Blue", value: "#536b85" },
  { name: "Navy", value: "#293b59" },
  { name: "Brown", value: "#78543d" },
  { name: "Rust", value: "#a65e43" },
  { name: "Pink", value: "#c88f91" },
  { name: "Black", value: "#292929" },
  { name: "White", value: "#f5f3ee" },
];

export default function RoomVisualizer() {
  const [sofaPreview, setSofaPreview] = useState("");
  const [roomPreview, setRoomPreview] = useState("");
  const [sofaColor, setSofaColor] = useState(null);
  const [recoloredSofaPreview, setRecoloredSofaPreview] = useState("");
  const [sofaWidth, setSofaWidth] = useState(42);
  const [sofaX, setSofaX] = useState(50);
  const [sofaY, setSofaY] = useState(65);
  const [rotation, setRotation] = useState(0);
  const [removingBackground, setRemovingBackground] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const originalSofaUrlRef = useRef("");
  const roomUrlRef = useRef("");

  // Clean up temporary image URLs.
  useEffect(() => {
    return () => {
      if (originalSofaUrlRef.current) {
        URL.revokeObjectURL(originalSofaUrlRef.current);
      }
      if (roomUrlRef.current) {
        URL.revokeObjectURL(roomUrlRef.current);
      }
    };
  }, []);

  // Recolour the transparent sofa image whenever a colour is selected.
  useEffect(() => {
    if (!sofaPreview || !sofaColor) {
      setRecoloredSofaPreview("");
      return;
    }

    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (cancelled) return;

      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const ctx = canvas.getContext("2d", {
          willReadFrequently: true,
        });

        if (!ctx) {
          setError("Could not process the sofa image. Please try again.");
          return;
        }

        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const pixels = imageData.data;

        const targetR = parseInt(sofaColor.slice(1, 3), 16);
        const targetG = parseInt(sofaColor.slice(3, 5), 16);
        const targetB = parseInt(sofaColor.slice(5, 7), 16);

        for (let i = 0; i < pixels.length; i += 4) {
          const alpha = pixels[i + 3];

          // Keep transparent pixels transparent.
          if (alpha === 0) continue;

          const oldR = pixels[i];
          const oldG = pixels[i + 1];
          const oldB = pixels[i + 2];

          // Preserve the original sofa's light and shadow details.
          const brightness =
            (0.299 * oldR + 0.587 * oldG + 0.114 * oldB) / 255;

          const shade = 0.38 + brightness * 0.78;

          pixels[i] = Math.min(255, targetR * shade);
          pixels[i + 1] = Math.min(255, targetG * shade);
          pixels[i + 2] = Math.min(255, targetB * shade);
        }

        ctx.putImageData(imageData, 0, 0);

        if (!cancelled) {
          setRecoloredSofaPreview(canvas.toDataURL("image/png"));
          setError("");
          setStatus("Sofa colour updated.");
        }
      } catch (err) {
        console.error("Sofa recolouring error:", err);
        if (!cancelled) {
          setError(
            "Could not change the colour. Please upload the sofa image again."
          );
        }
      }
    };

    image.onerror = () => {
      if (!cancelled) {
        setError("Could not load the sofa image. Please upload it again.");
      }
    };

    image.src = sofaPreview;

    return () => {
      cancelled = true;
    };
  }, [sofaPreview, sofaColor]);

  async function handleUpload(event, type) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setStatus("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Please upload an image smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    if (type === "room") {
      const url = URL.createObjectURL(file);

      if (roomUrlRef.current) {
        URL.revokeObjectURL(roomUrlRef.current);
      }

      roomUrlRef.current = url;
      setRoomPreview(url);
      setStatus("Room photo uploaded.");
      return;
    }

    setRemovingBackground(true);
    setStatus("Removing sofa background...");
    setSofaColor(null);
    setRecoloredSofaPreview("");

    try {
      const transparentBlob = await removeBackground(file);
      const url = URL.createObjectURL(transparentBlob);

      if (originalSofaUrlRef.current) {
        URL.revokeObjectURL(originalSofaUrlRef.current);
      }

      originalSofaUrlRef.current = url;
      setSofaPreview(url);
      setStatus("Sofa ready. Choose a colour below.");
    } catch (err) {
      console.error("Background removal error:", err);
      setError(
        "Background removal failed. Check your internet connection and try again."
      );
      setStatus("");
    } finally {
      setRemovingBackground(false);
      event.target.value = "";
    }
  }

  function startDragging(event) {
    if (!stageRef.current) return;

    event.preventDefault();

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originalX: sofaX,
      originalY: sofaY,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function dragSofa(event) {
    if (!dragRef.current || !stageRef.current) return;

    const rect = stageRef.current.getBoundingClientRect();

    const deltaX =
      ((event.clientX - dragRef.current.startX) / rect.width) * 100;
    const deltaY =
      ((event.clientY - dragRef.current.startY) / rect.height) * 100;

    setSofaX(
      Math.max(0, Math.min(100, dragRef.current.originalX + deltaX))
    );
    setSofaY(
      Math.max(0, Math.min(100, dragRef.current.originalY + deltaY))
    );
  }

  function stopDragging() {
    dragRef.current = null;
  }

  function resetPosition() {
    setSofaX(50);
    setSofaY(65);
    setSofaWidth(42);
    setRotation(0);
  }

  function resetAll() {
    if (originalSofaUrlRef.current) {
      URL.revokeObjectURL(originalSofaUrlRef.current);
      originalSofaUrlRef.current = "";
    }

    if (roomUrlRef.current) {
      URL.revokeObjectURL(roomUrlRef.current);
      roomUrlRef.current = "";
    }

    setSofaPreview("");
    setRoomPreview("");
    setSofaColor(null);
    setRecoloredSofaPreview("");
    setSofaWidth(42);
    setSofaX(50);
    setSofaY(65);
    setRotation(0);
    setError("");
    setStatus("");
    setRemovingBackground(false);
  }

  function downloadPreview() {
    if (!stageRef.current || !roomPreview || !sofaPreview) return;

    const roomImage = new Image();
    const sofaImage = new Image();

    const selectedSofa =
      sofaColor && recoloredSofaPreview
        ? recoloredSofaPreview
        : sofaPreview;

    roomImage.onload = () => {
      sofaImage.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = roomImage.naturalWidth;
        canvas.height = roomImage.naturalHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(roomImage, 0, 0, canvas.width, canvas.height);

        const stageRect = stageRef.current.getBoundingClientRect();
        const sofaDisplayWidth = (sofaWidth / 100) * stageRect.width;
        const aspectRatio =
          sofaImage.naturalHeight / sofaImage.naturalWidth;
        const sofaDisplayHeight = sofaDisplayWidth * aspectRatio;

        const scaleX = canvas.width / stageRect.width;
        const scaleY = canvas.height / stageRect.height;

        const drawWidth = sofaDisplayWidth * scaleX;
        const drawHeight = sofaDisplayHeight * scaleY;
        const centerX = (sofaX / 100) * canvas.width;
        const centerY = (sofaY / 100) * canvas.height;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(
          sofaImage,
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight
        );
        ctx.restore();

        const link = document.createElement("a");
        link.download = "fezmo-room-preview.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      };

      sofaImage.onerror = () => {
        setError("Could not prepare the sofa image for download.");
      };

      sofaImage.src = selectedSofa;
    };

    roomImage.onerror = () => {
      setError("Could not prepare the room image for download.");
    };

    roomImage.src = roomPreview;
  }

  const selectedColorName = sofaColors.find(
    (color) => color.value === sofaColor
  )?.name;

  const displayedSofa =
    sofaColor && recoloredSofaPreview
      ? recoloredSofaPreview
      : sofaPreview;

  return (
    <main className="visualizer-page">
      
<header className="visualizer-heading">
  <p className="visualizer-eyebrow">FEZMO FURNITURE</p>
  <h1>Visualise Your Furniture</h1>
  <p>
    Upload a furniture photo and a room photo to see how your
    favourite pieces could look in your space.
  </p>
</header>


      <div className="visualizer-workspace">
        <section className="upload-panel">
          <div className="upload-card">
            <h2>01. Furniture Photo</h2>
            <p>Choose a clear photo of your furniture.</p>

            <label className="upload-button">
              {removingBackground ? "Processing furniture..." : "Upload Furniture"}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={removingBackground}
                onChange={(event) => handleUpload(event, "sofa")}
              />
            </label>

            {sofaPreview && (
              <img
                className="upload-thumbnail sofa-thumbnail"
                src={sofaPreview}
                alt="Original sofa"
              />
            )}
          </div>

          <div className="upload-card">
            <h2>02. Room Photo</h2>
            <p>Choose a photo of the room where you want the sofa.</p>

            <label className="upload-button">
              Upload Room
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => handleUpload(event, "room")}
              />
            </label>

            {roomPreview && (
              <img
                className="upload-thumbnail"
                src={roomPreview}
                alt="Uploaded room"
              />
            )}
          </div>

          {removingBackground && (
            <p className="visualizer-processing">
              Removing the background from your sofa. This may take a little
              time.
            </p>
          )}

          {status && <p role="status">{status}</p>}
          {error && (
            <p className="visualizer-error" role="alert">
              {error}
            </p>
          )}
        </section>

        <section className="preview-panel">
          <div className="preview-heading">
            <div>
              <h2>Your Room Preview</h2>
              <p>Move your sofa into position.</p>
            </div>
            <span className="preview-tag">LIVE PREVIEW</span>
          </div>

          {roomPreview ? (
            <div className="room-stage" ref={stageRef}>
              <img
                className="room-background"
                src={roomPreview}
                alt="Room background"
                draggable="false"
              />

              {sofaPreview && (
                <img
                  key={displayedSofa}
                  className="sofa-overlay"
                  src={displayedSofa}
                  alt="Sofa in selected colour"
                  draggable="false"
                  onPointerDown={startDragging}
                  onPointerMove={dragSofa}
                  onPointerUp={stopDragging}
                  onPointerCancel={stopDragging}
                  style={{
                    left: `${sofaX}%`,
                    top: `${sofaY}%`,
                    width: `${sofaWidth}%`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                  }}
                />
              )}

              {!sofaPreview && (
                <div className="stage-hint">
                  Upload a sofa photo to place it here.
                </div>
              )}
            </div>
          ) : (
            <div className="preview-empty">
              <div className="preview-empty-icon">⌂</div>
              <h3>Your room preview will appear here</h3>
              <p>Upload a room photo to get started.</p>
            </div>
          )}

          {sofaPreview && roomPreview && (
            <div className="sofa-controls">
              <label className="control-label" htmlFor="sofa-size">
                Resize Sofa
              </label>

              <input
                id="sofa-size"
                type="range"
                min="15"
                max="80"
                value={sofaWidth}
                onChange={(event) =>
                  setSofaWidth(Number(event.target.value))
                }
              />

              <div className="control-label">Rotate Sofa</div>
              <select
                value={rotation}
                onChange={(event) =>
                  setRotation(Number(event.target.value))
                }
              >
                <option value={0}>No rotation</option>
                <option value={-15}>-15°</option>
                <option value={-10}>-10°</option>
                <option value={10}>10°</option>
                <option value={15}>15°</option>
              </select>

              <div className="sofa-color-controls">
                <p className="control-label">Choose Sofa Colour</p>

                <div className="sofa-color-options">
                  {sofaColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`sofa-color-option ${
                        sofaColor === color.value ? "selected" : ""
                      }`}
                      onClick={() => {
                        setError("");
                        setSofaColor(color.value);
                        setStatus(`Applying ${color.name} colour...`);
                      }}
                      aria-label={color.name}
                      aria-pressed={sofaColor === color.value}
                      title={color.name}
                      style={{ backgroundColor: color.value }}
                    >
                      {sofaColor === color.value && (
                        <span className="color-check">✓</span>
                      )}
                    </button>
                  ))}
                </div>

                <p className="selected-color-name">
                  {sofaColor
                    ? `Selected: ${selectedColorName || "Custom colour"}`
                    : "Original colour · Click a circle to change it"}
                </p>
              </div>

              <p className="drag-tip">
                Tip: Click and drag the sofa to move it around the room.
              </p>

              <div className="preview-actions">
                <button
                  type="button"
                  className="generate-button"
                  onClick={downloadPreview}
                  disabled={Boolean(sofaColor && !recoloredSofaPreview)}
                >
                  Download Preview
                </button>

                <button
                  type="button"
                  className="reset-button"
                  onClick={resetPosition}
                >
                  Reset Position
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <button type="button" className="reset-all" onClick={resetAll}>
        Start Again
      </button>

      <p className="privacy-note">
        Your photos are processed in your browser. Colour previews are
        approximate and may look different from actual fabric.
      </p>
    </main>
  );
}
