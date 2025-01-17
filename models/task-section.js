class TaskSection {
  constructor(
    id,
    title,
    color,
    icon,
    benefits,
    description,
    target,
    placeholderQuestion
  ) {
    this.id = id;
    this.title = title;
    this.color = color;
    this.icon = icon;
    this.benefits = benefits;
    this.description = description;
    this.target = target;
    this.placeholderQuestion = placeholderQuestion;
  }
}

export default TaskSection;
