import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReportAnswerSchema = new Schema({
    report: {
        type: Schema.Types.ObjectId,
        ref: 'Report',
        required: true,
        unique: true
    },
    title: {type: String, required: true},
    text: {type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: 'Operator', required: true },
    created: {type: Date, default: Date.now}
});

const ReportAnswer = mongoose.model('ReportAnswer', ReportAnswerSchema);

export default ReportAnswer;