export default class APIFeatures {
  query: any;
  queryString: any;

  constructor(query: any, queryString: any) {
    (this.query = query), (this.queryString = queryString);
  }

  filter() {
    const queryObj = { ...this.queryString };
    const valueFilter = Number(queryObj.filter);

    switch (valueFilter) {
      case 0: {
        this.query.find({ status: false });
        break;
      }
      case 1: {
        this.query.find({ status: true });
        break;
      }
      default: {
        this.query.find();
      }
    }
    this.query.select("-__v");
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      switch (Number(this.queryString.sort)) {
        case 0: {
          this.query.sort({ createAt: 1 });
          break;
        }
        case 1: {
          this.query.sort({ createAt: -1 });
          break;
        }
        default: {
          this.query.sort();
        }
      }
    } else {
      this.query.sort({ createAt: -1 });
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 3;
    const skip = (page - 1) * limit;

    this.query.skip(skip).limit(limit);

    return this;
  }

  search() {
    const search = this.queryString.search;

    if (search) {
      this.query.find({ name: { $regex: ".*" + search + ".*" } });
    } else {
      this.query.find();
    }

    return this;
  }
}
