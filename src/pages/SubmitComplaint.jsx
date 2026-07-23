import { useEffect, useRef, useState } from 'react'

const DEPARTMENTS = [
  'Roads',
  'Garbage',
  'Drainage',
  'Water Supply',
  'Street Lights',
  'Electricity',
  'Public Transport',
  'Health',
  'Parks',
  'Other',
]

function IconUpload(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}

function IconCamera(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 8a2 2 0 0 1 2-2h1.5l1-1.5h7l1 1.5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

function IconTrash(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 7h16" />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  )
}

function IconPin(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  )
}

function IconLayers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 16l9 5 9-5" />
    </svg>
  )
}

function IconEdit(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
    </svg>
  )
}

function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export default function SubmitComplaint() {
  const [step, setStep] = useState('form') // 'form' | 'preview'

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [description, setDescription] = useState('')
  const [descTouched, setDescTouched] = useState(false)

  const [location, setLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')

  const [department, setDepartment] = useState('auto')

  const galleryInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  // Revoke the object URL whenever it changes or the component unmounts,
  // so we don't leak memory across selections.
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const isDescriptionValid = description.trim().length >= 15 && description.length <= 500
  const isFormValid = Boolean(imageFile) && isDescriptionValid && Boolean(location)

  function handleImageSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleRemoveImage() {
    setImageFile(null)
    setImagePreview(null)
    if (galleryInputRef.current) galleryInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      return
    }
    setLocating(true)
    setLocationError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Location permission denied. Please enable it in your browser settings.')
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocationError('Location information is unavailable right now.')
        } else if (err.code === err.TIMEOUT) {
          setLocationError('Location request timed out. Please try again.')
        } else {
          setLocationError('Could not fetch your location. Please try again.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  function handleReset() {
    setImageFile(null)
    setImagePreview(null)
    setDescription('')
    setDescTouched(false)
    setLocation(null)
    setLocationError('')
    setDepartment('auto')
    if (galleryInputRef.current) galleryInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  function handleNext(e) {
    e.preventDefault()
    if (!isFormValid) return
    setStep('preview')
  }

  if (step === 'preview') {
    const departmentLabel =
      department === 'auto' ? 'Auto Detect (assigned in Milestone 4)' : department

    return (
      <main className="submit-page">
        <div className="page-head">
          <p className="eyebrow">Review</p>
          <h1>Review Your Complaint</h1>
          <p className="page-sub">Nothing has been submitted yet — check the details below.</p>
        </div>

        <div className="preview-card">
          <img src={imagePreview} alt="Complaint" className="preview-image" />

          <div className="preview-block">
            <span className="preview-row-label">Description</span>
            <p className="preview-description">{description}</p>
          </div>

          <div className="preview-row">
            <span className="preview-row-label">Latitude</span>
            <span className="preview-row-value">{location.lat.toFixed(6)}</span>
          </div>
          <div className="preview-row">
            <span className="preview-row-label">Longitude</span>
            <span className="preview-row-value">{location.lng.toFixed(6)}</span>
          </div>
          <div className="preview-row">
            <span className="preview-row-label">Address</span>
            <span className="preview-row-value">Not available yet (Milestone 3)</span>
          </div>
          <div className="preview-row">
            <span className="preview-row-label">Department</span>
            <span className="preview-row-value">{departmentLabel}</span>
          </div>

          <p className="preview-note">
            This is a preview only — submission is enabled in a later milestone.
          </p>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setStep('form')}>
              <IconEdit /> Back to Edit
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="submit-page">
      <div className="page-head">
        <p className="eyebrow">Report an Issue</p>
        <h1>Submit a Complaint</h1>
        <p className="page-sub">
          Fill in the details below — you'll review everything before it's finalized.
        </p>
      </div>

      <form className="form-card" onSubmit={handleNext}>
        <section className="form-section">
          <span className="section-label">
            <IconUpload className="section-icon" /> Complaint Image
          </span>

          {!imagePreview ? (
            <div className="upload-row">
              <button
                type="button"
                className="upload-btn"
                onClick={() => galleryInputRef.current?.click()}
              >
                <IconUpload /> Choose from Gallery
              </button>
              <button
                type="button"
                className="upload-btn"
                onClick={() => cameraInputRef.current?.click()}
              >
                <IconCamera /> Take Photo
              </button>
            </div>
          ) : (
            <div className="image-preview-wrap">
              <img src={imagePreview} alt="Selected complaint" className="image-preview" />
              <button
                type="button"
                className="remove-image-btn"
                onClick={handleRemoveImage}
                aria-label="Remove image"
              >
                <IconTrash />
              </button>
            </div>
          )}

          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            hidden
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            hidden
          />
        </section>

        <div className="section-divider" />

        <section className="form-section">
          <label className="section-label" htmlFor="description">
            <IconEdit className="section-icon" /> Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => setDescTouched(true)}
            maxLength={500}
            rows={4}
            placeholder="Describe the issue — what's wrong, and any details that would help the department act on it."
          />
          <div className="char-counter">
            {descTouched && description.trim().length < 15 ? (
              <span className="counter-hint">Minimum 15 characters</span>
            ) : (
              <span />
            )}
            <span className="counter-count">{description.length} / 500</span>
          </div>
        </section>

        <div className="section-divider" />

        <section className="form-section">
          <span className="section-label">
            <IconPin className="section-icon" /> Location
          </span>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleUseLocation}
            disabled={locating}
          >
            {locating ? (
              <>
                <span className="spinner" /> Fetching location…
              </>
            ) : location ? (
              <>
                <IconCheck /> Location Captured
              </>
            ) : (
              'Use My Location'
            )}
          </button>

          {location && (
            <div className="coord-grid">
              <div className="coord-box">
                <span className="coord-label">Latitude</span>
                <span className="coord-value">{location.lat.toFixed(6)}</span>
              </div>
              <div className="coord-box">
                <span className="coord-label">Longitude</span>
                <span className="coord-value">{location.lng.toFixed(6)}</span>
              </div>
            </div>
          )}

          {locationError && <p className="field-error">{locationError}</p>}
        </section>

        <div className="section-divider" />

        <section className="form-section">
          <label className="section-label" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            type="text"
            className="address-input"
            readOnly
            value=""
            placeholder="Address lookup will be added in Milestone 3"
          />
        </section>

        <div className="section-divider" />

        <section className="form-section">
          <label className="section-label" htmlFor="department">
            <IconLayers className="section-icon" /> Department
          </label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="auto">Auto Detect (Coming in Milestone 4)</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </section>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
            Next
          </button>
        </div>
      </form>
    </main>
  )
}