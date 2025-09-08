export class CreateEventDto {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.date = data.date;
    this.organizer = data.organizer;
    this.status = data.status;
    this.tags = data.tags;
    this.capacity = data.capacity;
    if (data.image) this.image = data.image;
  }

  toModel() {
    return {
      ...this,
      isActive: true,
    };
  }
}

export class UpdateEventDto {
  constructor(data) {
    if (data.title) this.title = data.title;
    if (data.description) this.description = data.description;

    if (data.date) this.date = data.date;

    if (data.organizer) data.organizer;

    if (data.status) this.status = data.status;
    if (data.tags) this.tags = data.tags;
    if (data.capacity) this.capacity = data.capacity;

    if (data.image) this.image = data.image;

    this.updatedAt = new Date();
  }
}

export class EventResponseDto {
  constructor(event) {
    this.id = event._id;
    this.title = event.title;
    this.description = event.description;
    this.date = event.date;
    this.organizer = event.organizer;
    this.status = event.status;
    this.tags = event.tags;
    this.capacity = event.capacity;
    this.image = event.image;
    this.createdAt = event.createdAt;
    this.updatedAt = event.updatedAt;
  }
}
