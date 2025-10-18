import { BadRequestException } from '@nestjs/common';

export const FileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const validExtensions = ['pdf'];
  const fileExtension = file.mimetype.split('/')[1];

  if (!validExtensions.includes(fileExtension)) {
    return callback(
      new BadRequestException(
        `File ${file.mimetype} with invalid extension, expected type is application/pdf`,
      ),
      false,
    );
  }
  callback(null, true);
};

export const ImageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const validExtensions = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
  const fileExtension = file.mimetype.split('/')[1];

  if (!validExtensions.includes(fileExtension)) {
    return callback(
      new BadRequestException(
        `File ${file.mimetype} with invalid extension, expected image types: jpeg, jpg, png, gif, webp`,
      ),
      false,
    );
  }
  callback(null, true);
};
