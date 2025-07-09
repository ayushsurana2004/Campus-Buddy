const Assignment = require('../models/Assignment');

// Create a new assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, notes } = req.body;
    const assignment = new Assignment({
      title,
      description,
      dueDate,
      notes,
      user: req.user // user ID from JWT middleware
    });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    console.error('Create assignment error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all assignments for the logged-in user
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user });
    res.json(assignments);
  } catch (err) {
    console.error('Get assignments error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update an assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // If marking as completed, set completedAt timestamp
    if (updateData.completed === true) {
      updateData.completedAt = new Date();
    } else if (updateData.completed === false) {
      updateData.completedAt = null; // Clear completion timestamp if unmarking
    }
    
    const assignment = await Assignment.findOneAndUpdate(
      { _id: id, user: req.user },
      updateData,
      { new: true }
    );
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (err) {
    console.error('Update assignment error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete an assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findOneAndDelete({ _id: id, user: req.user });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    console.error('Delete assignment error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};