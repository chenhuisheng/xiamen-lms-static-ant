import { POST } from '../../utils'

export class UploadService {
  url = 'uploads'
  name = 'file'
  formData = new FormData
  uploading = false

  add(file: File) {
    this.formData.append(this.name, file)
  }

  async upload(
    onSuccess: (response: any) => void,
    onError: (error: any) => void,
    onProgress: (progress: number) => void
  ) {
    this.uploading = true
    try {
      const res = await POST(this.url, {
        data: this.formData,
        timeout: 5 * 60 * 1000,
        onUploadProgress: (event) => {
          onProgress(event.loaded / event.total * 100)
        }
      })
      onSuccess(res.data)

    } catch (e) {
      onError(e)

    } finally {
      this.uploading = false
    }
  }

}
