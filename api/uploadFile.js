import request from '@/utils/request'
import upload from '@/utils/upload'
import storage from '@/utils/storage'
import constant from '@/utils/constant'

// 上传图片
export function uploadFile(src, formData, baseUrlType) {
	return upload({
		'url': '/check/record/uploadFile',
		"baseUrlType": baseUrlType,
		"filePath": src,
		"formData": formData
	})

}

// 上传图片
export function uploadFileBase64(data, baseUrlType) {
	return request({
		'url': '/check/record/uploadFtpFileBase64',
		"baseUrlType": baseUrlType,
		'method': 'post',
		'data': data
	})

}