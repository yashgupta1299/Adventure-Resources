class APIfeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filtering() {
        // filtering
        const queryObj = { ...this.queryStr };
        const differenFields = ['page', 'sort', 'limit', 'fields'];
        differenFields.forEach(key => delete queryObj[key]);

        // advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );
        //say console.log(JSON.parse(queryStr)); is { ratingsAverage: [ '4.8', '4.5' ] }
        // mongoose give me or result in between elements of array
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryStr.fields) {
            const reqFields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(reqFields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    pagination() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIfeatures;
