export class CreateEventDto {
  constructor(data) {
    this.title = data.title;
    this.slug = data.slug;
    this.description = data.description;
    this.location = {
      name: data.location?.name,
      address: data.location?.address,
      room: data.location?.room,
    };
    this.date = data.date;
    this.endDate = data.endDate;
    this.organizer = {
      name: data.organizer?.name,
      contact: data.organizer?.contact,
    };
    this.status = data.status;
    this.tags = data.tags;
    this.capacity = data.capacity;
    this.tickets = {
      available: data.tickets?.available ?? true,
      price: data.tickets?.price,
      currency: data.tickets?.currency,
      link: data.tickets?.link,
    };
    this.media = {
      banner: data.media?.banner,
      gallery: data.media?.gallery ?? [],
    };
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
    if (data.location) {
      this.location = {};
      if (data.location.name) this.location.name = data.location.name;
      if (data.location.address) this.location.address = data.location.address;
      if (data.location.room) this.location.room = data.location.room;
    }
    if (data.date) this.date = data.date;
    if (data.endDate) this.endDate = data.endDate;
    if (data.organizer) {
      this.organizer = {};
      if (data.organizer.name) this.organizer.name = data.organizer.name;
      if (data.organizer.contact)
        this.organizer.contact = data.organizer.contact;
    }
    if (data.status) this.status = data.status;
    if (data.tags) this.tags = data.tags;
    if (data.capacity) this.capacity = data.capacity;
    if (data.tickets) {
      this.tickets = {};
      if (data.tickets.available !== undefined)
        this.tickets.available = data.tickets.available;
      if (data.tickets.price) this.tickets.price = data.tickets.price;
      if (data.tickets.currency) this.tickets.currency = data.tickets.currency;
      if (data.tickets.link) this.tickets.link = data.tickets.link;
    }
    if (data.media) {
      this.media = {};
      if (data.media.banner) this.media.banner = data.media.banner;
      if (data.media.gallery) this.media.gallery = data.media.gallery;
    }
    this.updatedAt = new Date();
  }
}

export class EventResponseDto {
  constructor(event) {
    this.id = event._id;
    this.title = event.title;
    this.slug = event.slug;
    this.description = event.description;
    this.location = event.location;
    this.date = event.date;
    this.endDate = event.endDate;
    this.organizer = event.organizer;
    this.status = event.status;
    this.tags = event.tags;
    this.capacity = event.capacity;
    this.tickets = {
      available: event.tickets.available,
      price: event.tickets.price,
      currency: event.tickets.currency,
      link: event.tickets.link,
    };
    this.media = event.media;
    this.createdAt = event.createdAt;
    this.updatedAt = event.updatedAt;
  }
}
