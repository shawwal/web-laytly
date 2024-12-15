// utils/upload.ts

import * as tus from 'tus-js-client'

interface UploadOptions {
  file: File
  session: { access_token: string }
  bucketName: string
  customPath?: string,
  onProgress: (progress: number) => void
  onError: (errorMessage: string) => void
  onSuccess: (uploadedFileUrl: string) => void
}

export const uploadFile = async ({
  file,
  session,
  bucketName,
  customPath,
  onProgress,
  onError,
  onSuccess
}: UploadOptions) => {
  const fileName = `${Date.now()}_${file.name}`
  const path = customPath ? `${customPath}/${fileName}` : `images/${fileName}`;

  // Convert the file to Blob for upload
  const fileBlob = await file.arrayBuffer()
  const uploadBlob = new Blob([fileBlob])

  const upload = new tus.Upload(uploadBlob, {
    endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,  // Ensure correct endpoint
    retryDelays: [0, 3000, 5000, 10000, 20000],
    headers: {
      'Authorization': `Bearer ${session.access_token}`,  // Attach the auth token
    },
    metadata: {
      bucketName,
      objectName: path,
      contentType: file.type,  // Set MIME type
    },
    chunkSize: 1 * 1024 * 1024,  // Set chunk size to 1MB
    onProgress: function (bytesUploaded, bytesTotal) {
      const percentage = (bytesUploaded / bytesTotal) * 100
      onProgress(percentage)
    },
    onError: function (error) {
      onError('Upload failed: ' + error.message)
    },
    onSuccess: async function () {
      const uploadedFileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${path}`
      onSuccess(uploadedFileUrl)
    }
  })

  // Check for previous uploads to resume
  upload.findPreviousUploads().then((previousUploads) => {
    if (previousUploads.length) {
      upload.resumeFromPreviousUpload(previousUploads[0])
    }
    upload.start()
  })
}
